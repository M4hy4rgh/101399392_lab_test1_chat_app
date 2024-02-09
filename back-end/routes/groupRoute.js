const express = require("express"); // Import express
const router = express.Router(); // Create a router object
const Group = require("../model/group.js"); // Import group.js
const User = require("../model/user.js"); // Import user.js
const GroupMessage = require("../model/groupMessage.js"); // Import groupMessage.js


// Create a new group
router.post("/create", async (req, res) => {
    try {
        const { name, members } = req.body;
        const isNameExist = await Group.findOne({ name });
        if (isNameExist) {
            return res.status(400).json({ error: "Group name already exists" });
        } else {

            const newGroup = new Group({ name, members });
            await newGroup.save();
            res.status(201).json(newGroup);
        }
    } catch (error) {
    res.status(500).json({ error: error.message });
}
});

// update the Group
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findByIdAndUpdate(id, req.body, { new: true });
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete the Group
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findByIdAndDelete(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get all the groups
router.get("/groups", async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get a group by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// add a member to a group
router.post("/:id/members", async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;

        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const user = await User.findById(memberId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMember = group.members.find((member) => member.toString() === memberId);
        if (isMember) {
            return res.json({ error: "User is already a member of this group" });
        } else {// might change this section of code bny adding else statement

            group.members.push(memberId);
            await group.save();
            res.status(200).json({
                message: "User added to the group successfully",
                group,
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// remove a member from a group
router.delete("/:id/members/:memberId", async (req, res) => {
    try {
        const { id, memberId } = req.params;

        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const user = await User.findById(memberId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        } // might not need this code becasue when the checking below is done, we automatically know if the user is a exist or not

        const isMember = group.members.find((member) => member.toString() === memberId);
        if (!isMember) {
            return res.status(400).json({ error: "User is not a member of this group" });
        }

        group.members = group.members.filter((member) => member.toString() !== memberId); //might need to change this
        await group.save();
        res.status(200).json({
            message: "User removed from the group successfully",
            group,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get all the members of a group
router.get("/:id/members", async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id).populate("members", "username");
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.status(200).json(group.members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// get member by id
router.get("/:id/members/:memberId", async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const group = await Group.findById(id).populate("members", "username");
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const member = group.members.find((member) => member._id.toString() === memberId);
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// get all the messages of a group

/** router.get("/:id/messages", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const group = await Group.findById(id).populate("messages", "message sender");
//         if (!group) {
//             return res.status(404).json({ error: "Group not found" });
//         }

//         res.status(200).json(group.messages);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
*/

router.get("/:id/messages", async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await GroupMessage.find({ group: id }).populate("sender", "username").sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add a message id to a group
router.post("/:id/message", async (req, res) => {
    try {
        const { id } = req.params;
        const { messageid } = req.body;

        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        group.messages.push(messageid);
        await group.save();
        res.status(200).json({
            message: "Message added to the group successfully",
            group,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
