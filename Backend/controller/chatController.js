import prisma from "../db/dbConfig.js";

export const createConversation = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    // Validation
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself",
      });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: senderId } } },
          { participants: { some: { id: receiverId } } },
        ],
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation retrieved",
        data: existingConversation,
      });
    }

    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: senderId }, { id: receiverId }],
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Emit Socket.io event
    req.io.emit("conversation_created", newConversation);

    res.status(201).json({
      success: true,
      message: "Conversation created",
      data: newConversation,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and content are required",
      });
    }

    if (!content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { id: senderId },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    req.io.to(conversationId).emit("receive_message", newMessage);

    // Get conversation details for notification
    const notification = {
      type: "new_message",
      conversationId,
      senderName: newMessage.sender.name,
      message: content.substring(0, 100), // First 100 chars
      timestamp: newMessage.createdAt,
    };

    // Notify other participants in the conversation
    const conversation_full = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: { select: { id: true } } },
    });

    conversation_full.participants.forEach((participant) => {
      if (participant.id !== senderId) {
        req.io
          .to(participant.id)
          .emit("new_message_notification", notification);
      }
    });

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { id: userId },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    next(error);
  }
};
