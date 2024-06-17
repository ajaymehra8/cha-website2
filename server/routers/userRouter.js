const express=require("express");
const Router=express.Router();
const userController =require("../controllers/userController");
const protect=require("../middlewares/authorization");

const {uploadUserPhoto,uploadPhotoToFirebase,resizeUserPhoto}=require("../middlewares/file");

Router.use(uploadUserPhoto);
Router.post("/login",userController.login);
Router.post("/signup",resizeUserPhoto,uploadPhotoToFirebase,userController.signup);
Router.post("/delete",userController.deleteAllUser);
Router.route('/').get(protect,userController.getAllUser);


module.exports=Router;