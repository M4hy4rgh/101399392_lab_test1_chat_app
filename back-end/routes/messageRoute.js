const express = require("express"); // Import express
const router = express.Router(); // Create a router object
const Group = require("../model/group.js"); // Import group.js
const User = require("../model/user.js"); // Import user.js
const GroupMessage = require("../model/groupMessage.js"); // Import groupMessage.js
const PrivateMessage = require("../model/privateMessage.js"); // Import privateMessage.js

// Create a new group message
router.post("/group/:groupId/message", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { message, sender } = req.body;
        // console.log("here we gooooooo");

    // Find the group by id
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

    // Check if the sender is a member of the group
        const isMember = group.members.includes(sender);
        if (!isMember) {
            return res
                .status(403)
                .json({ error: "Sender is not a member of the group" });
        }


    // Create a new group message
        const newGroupMessage = new GroupMessage({
            message,
            sender,
            group: groupId,
        });
        await newGroupMessage.save(); // Save the message

        res.status(201).json(newGroupMessage); // Send the message
    } catch (error) {
        res.status(500).json({ error: error.message }); // If there is an error, send a 500 error
    }
});


// Delete the group message
router.delete("/group/:groupId/message/:messageId", async (req, res) => {
    try {
        const { groupId, messageId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        // Check if the message exists
        const message = await GroupMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if the message belongs to the group
        if (message.group.toString() !== groupId) {
            return res.status(403).json({ error: "Message does not belong to the group" });
        }

        // Delete the message
        // await GroupMessage.findByIdAndDelete(messageId);
        await message.remove();


        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//================================================================================================

// Create a new private message
router.post("/private/message", async (req, res) => {
    try {
        const { message, sender, receiver } = req.body;


    // Check if sender and receiver exist
        const senderExists = await User.exists({ _id: sender });
        const receiverExists = await User.exists({ _id: receiver });

        if (!senderExists || !receiverExists) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        const newPrivateMessage =
            new PrivateMessage({ message, sender, receiver });
        
        await newPrivateMessage.save();
        res.status(201).json(newPrivateMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete the private message
router.delete("/private/message/:messageId", async (req, res) => {
    try {
        const messageId = req.params.messageId;

        const message = await PrivateMessage.findByIdAndDelete(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all private messages
router.get("/private/messages", async (req, res) => {
    try {
        const messages = await PrivateMessage
            .find()
            .populate("sender", "username")
            .populate("receiver", "username")
            .select("message createdAt");
        
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; // Export the router