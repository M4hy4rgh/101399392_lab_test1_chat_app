const mongoose = require("mongoose");
const validator = require("validator");

const privateMessageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);
module.exports = PrivateMessage;