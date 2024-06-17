const jwt=require("jsonwebtoken");
const generateToken=async(id)=>{
token=await jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
return token;
}

module.exports=generateToken;