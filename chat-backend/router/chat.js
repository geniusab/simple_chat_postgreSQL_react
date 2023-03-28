const router = require("express").Router();
const {
  chat,
  create,
  messages,
  deleteChat,
} = require("../controllers/chatController");
const { auth: authMiddleware } = require("../middleware/auth");

router.get("/", [authMiddleware], chat);
router.post("/create", [authMiddleware], create);
router.post("/messages", [authMiddleware], messages);
router.post("/:id", [authMiddleware], deleteChat);

module.exports = router;