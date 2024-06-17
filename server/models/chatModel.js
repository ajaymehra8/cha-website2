const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
chatName:{
    type:String,
    trim:true
},
isGroupedChat:{
    type:Boolean,
    default:false
},
users:[{
    type:mongoose.Schema.ObjectId,
    ref:'Users',
    required:true
}],
latestMessage:{
    type:mongoose.Schema.ObjectId,
    ref:'Messages'
},
groupAdmin:{
    type:mongoose.Schema.ObjectId,
    ref:'Users',
}
},{
    timestamps:true
});

module.exports=mongoose.model('Chats',chatSchema);