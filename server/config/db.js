const mongoose = require("mongoose");

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.log("Problem in connecting database...");
        console.log(err.message);
    }
};
module.exports=db;