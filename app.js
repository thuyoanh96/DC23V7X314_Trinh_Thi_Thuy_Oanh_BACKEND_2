const express = require("express");
const cors = require("cors");
const app = express();
const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

// Đặt router của contacts
app.use("/api/contacts", contactsRouter);

// Middleware xử lý lỗi 404 cho các route không tồn tại
app.use((req, res, next) => {
  next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
