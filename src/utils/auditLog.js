const prisma = require("../database");

async function writeAudit(user, action, target) {
  try {
    let actorName = user?.name;

    if (!actorName && user?.id) {
      const found = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true },
      });
      actorName = found?.name;
    }

    await prisma.auditLog.create({
      data: {
        actor_id: user?.id ?? null,
        actor_name: actorName || "Super Admin",
        action,
        target: String(target || "-").slice(0, 255),
      },
    });
  } catch (err) {
    console.error("Gagal menulis audit log:", err.message);
  }
}

module.exports = { writeAudit };