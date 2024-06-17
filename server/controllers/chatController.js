const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
exports.accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Select a user you want to chat",
    });
  }
  let isChat = await Chat.find({
    isGroupedChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.status(200).json({
      success: true,
      chat: isChat[0],
    });
  } else {
    const chatData = {
      chatName: "sender",
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
      );
      res.status(200).json({
        success: true,
        chat: fullChat,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Problem in creating a new chat",
      });
    }
  }
});

exports.fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send({
      success: true,
      length: chats.length,
      chats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Problem in getting chats",
    });
  }
});

exports.createGroupChat = expressAsyncHandler(async (req, res) => {
  let { users, name } = req.body;
  console.log(users,name);
  if (!users || !name) {
    return res.status(400).json({
      success: false,
      message: "Provide all credentials",
    });
  }
  if (typeof users === 'string') {
    users = JSON.parse(users);
  }
  users.push(req.user._id);

  if (users.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Group must have more than two people",
    });
  }
  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupedChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    res.status(200).json({
      success: true,
      chat: fullGroupChat,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Problem in creating group chat",
    });
  }
});

exports.renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400).json({
      success: false,
      message: "Problem in updating chat",
    });
  } else {
    res.status(200).json({
      success: true,
      chat: updatedChat,
    });
  }
});

exports.addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addedTo = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!addedTo) {
    res.status(400).json({
      success: false,
      message: "Problem in adding user to group",
    });
  } else {
    res.status(200).json({
      success: true,
      chat: addedTo,
    });
  }
});

exports.removeSomeoneFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removeTo = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removeTo) {
    res.status(400).json({
      success: false,
      message: "Problem in removing user to group",
    });
  } else {
    res.status(200).json({
      success: true,
      chat: removeTo,
    });
  }
});
