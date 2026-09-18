// src/index.js
require("dotenv/config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const usersRoutes = require("./routes/usersRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketTypeRoutes = require("./routes/ticketTypeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const PORT = Number(process.env.PORT) || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    message: "API Tiket Konser",
    version: "2.0.0",
    roles_supported: ["User", "Admin", "Penyelenggara"],
    status: "running",
  });
});

const api = express.Router();
api.use("/auth", authRoutes);
api.use("/me", profileRoutes);
api.use("/users", usersRoutes);
api.use("/categories", categoryRoutes);
api.use("/events", eventRoutes);
api.use("/", ticketTypeRoutes); // /events/:eventId/ticket-types, /ticket-types/:id
api.use("/favorites", favoriteRoutes);
api.use("/orders", orderRoutes);
api.use("/tickets", ticketRoutes);
api.use("/notifications", notificationRoutes);
api.use("/dashboard", dashboardRoutes);
api.use("/reviews", reviewRoutes);

app.use("/api", api);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🎟️  Tiket Konser API berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
