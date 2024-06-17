const mongoose = require("mongoose");
const bcrypt=require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://firebasestorage.googleapis.com/v0/b/natours-21ccd.appspot.com/o/users%2Fdefault.jpeg?alt=media&token=84a84cbe-1e3e-4713-8729-50ea090b3143",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword=async function(enteredPassword){
return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.pre("save",async function(next){
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)
})
module.exports = mongoose.model("Users", userSchema);
