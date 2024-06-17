const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

exports.sendMessage = expressAsyncHandler(async (req, res) => {
  const { chatId, message } = req.body;

  if (!message || !chatId) {
    return res.status(400).json({
      success: false,
      message: "There should be a message and chatId",
    });
  }
  let newMessage = {
    sender: req.user._id,
    content: message,
    chat: chatId,
  };
  try {
    var nowMessage = await Message.create(newMessage);

    nowMessage = await nowMessage.populate("sender", "name pic");
    nowMessage = await nowMessage.populate("chat");
    nowMessage = await User.populate(nowMessage, {
      path: "chat.user",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: nowMessage._id,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      nowMessage,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Problem in sending message",
    });
  }
});

exports.allMessage = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name,email,pic")
      .populate("chat");
      res.status(200).json({
        success:true,
        messages
      })
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Problem in getting all message",
    });
  }
});
