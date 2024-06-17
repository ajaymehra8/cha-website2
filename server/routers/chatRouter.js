const express=require("express");
const protect = require("../middlewares/authorization");
const chatController=require("../controllers/chatController");
const Router=express.Router();

Router.use(protect);

Router.route("/").post(chatController.accessChat).get(chatController.fetchChats);
Router.route("/group").post(chatController.createGroupChat);
Router.route("/rename-group").patch(chatController.renameGroup);
Router.route("/remove-someone").patch(chatController.removeSomeoneFromGroup);
Router.route("/add-to-group").patch(chatController.addToGroup);




module.exports=Router;