const express=require("express");
const protect = require("../middlewares/authorization");
const chatController=require("../controllers/chatController");
const messageController=require("../controllers/messageController");
const Router=express.Router();

Router.use(protect);

Router.route("/").post(messageController.sendMessage);
Router.get("/:chatId",messageController.allMessage);



module.exports=Router;