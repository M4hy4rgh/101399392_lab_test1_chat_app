const mongoose = require("mongoose");
const validator = require("validator");

const groupMessageSchema = new mongoose.Schema(
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
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
module.exports = GroupMessage;