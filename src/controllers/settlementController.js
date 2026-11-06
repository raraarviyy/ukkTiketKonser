const prisma = require("../database");

const FEE_KEY = "platform_fee_percent";
const DEFAULT_FEE = 5;
const COUNTED_STATUSES = ["paid", "refunded", "cancelled"];

const pad = (value) => String(value).padStart(2, "0");

const toNumber = (value) => Number(value ?? 0);

const organizerSelect = {
  select: { id: true, name: true, organization_name: true, email: true },
};

function serialize(settlement) {
  return {
    id: settlement.id,
    settlement_code: settlement.settlement_code,
    organizer: settlement.organizer,
    period_year: settlement.period_year,
    period_month: settlement.period_month,
    gmv: toNumber(settlement.gmv),
    platform_fee_percent: toNumber(settlement.platform_fee_percent),
    platform_fee: toNumber(settlement.platform_fee),
    refund: toNumber(settlement.refund),
    payout: toNumber(settlement.payout),
    status: settlement.status,
    due_date: settlement.due_date,
    processed_at: settlement.processed_at,
    settled_at: settlement.settled_at,
    created_at: settlement.created_at,
    updated_at: settlement.updated_at,
  };
}

function calculate(gmv, refund, feePercent) {
  const net = Math.max(gmv - refund, 0);
  const platformFee = Math.round((net * feePercent) / 100);
  const payout = Math.max(net - platformFee, 0);
  return { platformFee, payout };
}

async function readFeePercent(client = prisma) {
  const setting = await client.platformSetting.findUnique({
    where: { key: FEE_KEY },
  });
  if (!setting) return DEFAULT_FEE;
  const value = Number(setting.value);
  return Number.isNaN(value) ? DEFAULT_FEE : value;
}

async function getFee(req, res) {
  const feePercent = await readFeePercent();
  return res.json({
    message: "success",
    data: { fee_percent: feePercent },
    ok: true,
  });
}

async function updateFee(req, res) {
  const feePercent = Number(req.body.fee_percent);

  await prisma.$transaction(async (tx) => {
    await tx.platformSetting.upsert({
      where: { key: FEE_KEY },
      update: { value: String(feePercent), updated_by: req.user.id },
      create: {
        key: FEE_KEY,
        value: String(feePercent),
        updated_by: req.user.id,
      },
    });

    const pending = await tx.settlement.findMany({
      where: { status: "pending" },
    });

    for (const settlement of pending) {
      const { platformFee, payout } = calculate(
        toNumber(settlement.gmv),
        toNumber(settlement.refund),
        feePercent
      );

      await tx.settlement.update({
        where: { id: settlement.id },
        data: {
          platform_fee_percent: feePercent,
          platform_fee: platformFee,
          payout,
        },
      });
    }
  });

  return res.json({
    message: "Platform fee berhasil diperbarui",
    data: { fee_percent: feePercent },
    ok: true,
  });
}

async function getAllSettlements(req, res) {
  const { status, search, period_year, period_month } = req.query;

  const where = {};

  if (status) where.status = status;
  if (period_year) where.period_year = Number(period_year);
  if (period_month) where.period_month = Number(period_month);

  if (search) {
    where.OR = [
      { settlement_code: { contains: search, mode: "insensitive" } },
      { organizer: { name: { contains: search, mode: "insensitive" } } },
      {
        organizer: {
          organization_name: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  const data = await prisma.settlement.findMany({
    where,
    orderBy: [
      { period_year: "desc" },
      { period_month: "desc" },
      { id: "desc" },
    ],
    include: { organizer: organizerSelect },
  });

  return res.json({ message: "success", data: data.map(serialize), ok: true });
}

async function getSettlementById(req, res) {
  const id = Number(req.params.id);

  const settlement = await prisma.settlement.findUnique({
    where: { id },
    include: { organizer: organizerSelect },
  });

  if (!settlement) {
    return res
      .status(404)
      .json({ message: "Settlement tidak ditemukan", ok: false });
  }

  return res.json({ message: "success", data: serialize(settlement), ok: true });
}

async function generateSettlements(req, res) {
  const year = Number(req.body.year);
  const month = Number(req.body.month);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  const dueDate = new Date(year, month, 5);

  const orders = await prisma.order.findMany({
    where: {
      status: { in: COUNTED_STATUSES },
      paid_at: { gte: start, lt: end },
    },
    select: {
      total: true,
      status: true,
      event: { select: { organizer_id: true } },
    },
  });

  const groups = new Map();

  orders.forEach((order) => {
    const organizerId = order.event?.organizer_id;
    if (!organizerId) return;

    if (!groups.has(organizerId)) {
      groups.set(organizerId, { gmv: 0, refund: 0 });
    }

    const group = groups.get(organizerId);
    const total = toNumber(order.total);

    group.gmv += total;
    if (order.status !== "paid") group.refund += total;
  });

  const feePercent = await readFeePercent();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const [organizerId, group] of groups) {
    const existing = await prisma.settlement.findUnique({
      where: {
        organizer_id_period_year_period_month: {
          organizer_id: organizerId,
          period_year: year,
          period_month: month,
        },
      },
    });

    if (existing && existing.status !== "pending") {
      skipped += 1;
      continue;
    }

    const { platformFee, payout } = calculate(
      group.gmv,
      group.refund,
      feePercent
    );

    const values = {
      gmv: group.gmv,
      refund: group.refund,
      platform_fee_percent: feePercent,
      platform_fee: platformFee,
      payout,
    };

    if (existing) {
      await prisma.settlement.update({
        where: { id: existing.id },
        data: values,
      });
      updated += 1;
    } else {
      await prisma.settlement.create({
        data: {
          ...values,
          settlement_code: `SET-${year}${pad(month)}-${organizerId}`,
          organizer_id: organizerId,
          period_year: year,
          period_month: month,
          status: "pending",
          due_date: dueDate,
        },
      });
      created += 1;
    }
  }

  return res.json({
    message: "Settlement berhasil digenerate",
    data: { created, updated, skipped },
    ok: true,
  });
}

async function updateSettlementStatus(req, res) {
  const id = Number(req.params.id);
  const { status } = req.body;

  const settlement = await prisma.settlement.findUnique({
    where: { id },
    include: { organizer: organizerSelect },
  });

  if (!settlement) {
    return res
      .status(404)
      .json({ message: "Settlement tidak ditemukan", ok: false });
  }

  const validTransitions = {
    pending: "processing",
    processing: "settled",
  };

  if (validTransitions[settlement.status] !== status) {
    return res.status(400).json({
      message: `Status "${settlement.status}" tidak dapat diubah menjadi "${status}"`,
      ok: false,
    });
  }

  const data = { status };
  if (status === "processing") data.processed_at = new Date();
  if (status === "settled") data.settled_at = new Date();

  const updated = await prisma.settlement.update({
    where: { id },
    data,
    include: { organizer: organizerSelect },
  });

  if (status === "settled") {
    await prisma.notification.create({
      data: {
        user_id: settlement.organizer_id,
        title: "Payout Settlement Dicairkan",
        message: `Payout settlement ${settlement.settlement_code} sebesar Rp ${toNumber(
          settlement.payout
        ).toLocaleString("id-ID")} telah dicairkan.`,
        type: "payment",
      },
    });
  }

  return res.json({
    message: `Status settlement berhasil diubah menjadi ${status}`,
    data: serialize(updated),
    ok: true,
  });
}

async function getMySettlements(req, res) {
  const data = await prisma.settlement.findMany({
    where: { organizer_id: req.user.id },
    orderBy: [
      { period_year: "desc" },
      { period_month: "desc" },
      { id: "desc" },
    ],
    include: { organizer: organizerSelect },
  });

  return res.json({ message: "success", data: data.map(serialize), ok: true });
}

module.exports = {
  getFee,
  updateFee,
  getAllSettlements,
  getSettlementById,
  generateSettlements,
  updateSettlementStatus,
  getMySettlements,
};