const express = require("express");
const router = express.Router();
const contacts = require("../controllers/contact.controller.js");

// ✅ Kiểm tra tên hàm có đúng với controller không
router.get("/favorite", contacts.findAllFavorite);

router.post("/", contacts.create);
router.get("/", contacts.findAll);
router.get("/:id", contacts.findOne);
router.put("/:id", contacts.update);
router.delete("/:id", contacts.delete);
router.delete("/", contacts.deleteAll);

module.exports = router;
