require('dotenv').config()

const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
    });
}

module.exports = connectDB;
