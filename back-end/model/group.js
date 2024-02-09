const mongoose = require("mongoose");
const validator = require("validator");

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "GroupMessage",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
