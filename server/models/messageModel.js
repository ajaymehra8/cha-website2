const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({

    sender:{
        type:mongoose.Schema.ObjectId,
        ref:'Users'
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.ObjectId,
        ref:'Chats'
    },

},{
    timestamps:true
});

module.exports=mongoose.model('Messages',messageSchema);