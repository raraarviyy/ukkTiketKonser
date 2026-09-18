// src/controllers/categoryController.js
const prisma = require("../database");

async function getCategories(req, res) {
  const data = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { events: true } } },
  });
  return res.json({ message: "success", data, ok: true });
}

async function createCategory(req, res) {
  const { name } = req.body;
  const data = await prisma.category.create({ data: { name } });
  return res.status(201).json({ message: "success", data, ok: true });
}

async function updateCategory(req, res) {
  const id = Number(req.params.id);
  const { name } = req.body;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Kategori tidak ditemukan", ok: false });
  }

  const data = await prisma.category.update({ where: { id }, data: { name } });
  return res.json({ message: "success", data, ok: true });
}

async function deleteCategory(req, res) {
  const id = Number(req.params.id);

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Kategori tidak ditemukan", ok: false });
  }

  await prisma.category.delete({ where: { id } });
  return res.json({ message: "Kategori berhasil dihapus", ok: true });
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
