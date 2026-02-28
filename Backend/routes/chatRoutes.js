import express from "express";
import { AuthenticateToken } from "../middlewares/authMiddleware.js";
import {
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
} from "../controller/chatController.js";

const router = express.Router();

router.use(AuthenticateToken);

router.post("/create", createConversation);
router.get("/conversations", getConversations);
router.post("/message", sendMessage);
router.get("/:conversationId/messages", getMessages);

export default router;
