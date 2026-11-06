const prisma = require("../database");
const { writeAudit } = require("../utils/auditLog");

function formatJakarta(date) {
  return new Date(date)
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .slice(0, 16);
}

function serialize(log) {
  return {
    id: log.id,
    actor_id: log.actor_id,
    actor: log.actor_name,
    action: log.action,
    target: log.target,
    created_at: log.created_at,
    createdAt: formatJakarta(log.created_at),
  };
}

async function getAuditLogs(req, res) {
  const { search, action, date_from, date_to, limit } = req.query;

  const where = {};

  if (action) where.action = action;

  if (date_from || date_to) {
    where.created_at = {};
    if (date_from) where.created_at.gte = new Date(date_from);
    if (date_to) where.created_at.lte = new Date(date_to);
  }

  if (search) {
    where.OR = [
      { actor_name: { contains: search, mode: "insensitive" } },
      { action: { contains: search, mode: "insensitive" } },
      { target: { contains: search, mode: "insensitive" } },
    ];
  }

  const take = Math.min(Math.max(Number(limit) || 500, 1), 1000);

  const data = await prisma.auditLog.findMany({
    where,
    orderBy: { created_at: "desc" },
    take,
  });

  return res.json({ message: "success", data: data.map(serialize), ok: true });
}

async function createAuditLog(req, res) {
  const { action, target } = req.body;

  await writeAudit(req.user, action, target);

  const latest = await prisma.auditLog.findFirst({
    where: { actor_id: req.user.id, action },
    orderBy: { created_at: "desc" },
  });

  return res.status(201).json({
    message: "Audit log tercatat",
    data: latest ? serialize(latest) : null,
    ok: true,
  });
}

module.exports = { getAuditLogs, createAuditLog };