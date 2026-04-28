const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Participant = require("../models/participant");
const Group = require("../models/group");
const Event = require("../models/event");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
  try {
    const {
      ParticipantName,
      ParticipantEnrollmentNumber,
      ParticipantInstituteName,
      ParticipantCity,
      ParticipantMobile,
      ParticipantEmail,
      IsGroupLeader,
      GroupID
    } = req.body;

    if (!ParticipantName || !ParticipantEnrollmentNumber || !GroupID) {
      return res.status(400).json({ message: "Participant Name, Enrollment Number, and Group ID are required" });
    }

    // Validate if Group exists first to get the EventID
    const groupExists = await Group.findById(GroupID);
    if (!groupExists) {
      return res.status(404).json({ message: "The specified group does not exist." });
    }

    // Check if participant with this enrollment number is already registered FOR THIS EVENT
    const eventGroups = await Group.find({ EventID: groupExists.EventID });
    const eventGroupIds = eventGroups.map(g => g._id);

    const alreadyRegistered = await Participant.findOne({
      ParticipantEnrollmentNumber,
      GroupID: { $in: eventGroupIds }
    });

    if (alreadyRegistered) {
      return res.status(400).json({ message: `Participant with enrollment number ${ParticipantEnrollmentNumber} is already registered for this event.` });
    }

    const participant = await Participant.create({
      ParticipantName,
      ParticipantEnrollmentNumber,
      ParticipantInstituteName,
      ParticipantCity,
      ParticipantMobile,
      ParticipantEmail,
      IsGroupLeader: IsGroupLeader || false,
      GroupID,
      ModifiedBy: req.user?._id
    });

    res.status(201).json({ 
      message: "Participant registered successfully!", 
      participant 
    });
  } catch (err) {
    console.error("Error in participant registration:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate({
        path: 'GroupID',
        populate: {
          path: 'EventID',
          populate: {
            path: 'DepartmentID',
            populate: {
              path: 'InstituteID'
            }
          }
        }
      });
    res.status(200).json({ participants });
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Object ID" });
    }

    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const group = await Group.findById(participant.GroupID);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isGroupLeader = await Participant.exists({
      GroupID: group._id,
      IsGroupLeader: true,
      ModifiedBy: userId
    });


    const event = await Event.findById(group.EventID);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isEventCoordinator =
      event.EventCoOrdinatorID.toString() === userId.toString();

    if (!isGroupLeader && !isEventCoordinator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedUpdates = [
      "ParticipantName",
      "ParticipantInstituteName",
      "ParticipantCity",
      "ParticipantMobile",
      "ParticipantEmail",
      "IsGroupLeader"
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        participant[field] = req.body[field];
      }
    });

    participant.ModifiedBy = userId;

    await participant.save();

    res.status(200).json({
      message: "Participant updated successfully",
      participant
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Object ID" });
    }

    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const group = await Group.findById(participant.GroupID);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isGroupLeader = await Participant.exists({
      GroupID: group._id,
      IsGroupLeader: true,
      ModifiedBy: userId
    });

    const event = await Event.findById(group.EventID);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isEventCoOrdinator = event.EventCoOrdinatorID.toString() === userId.toString();
    // Simplified: If user is an Admin, they can delete anything. 
    // Otherwise, check if they are the creator/coordinator.
    if (req.user.isAdmin || isGroupLeader || isEventCoOrdinator) {
      const deletedParticipant = await Participant.findByIdAndDelete(id);
      return res.status(200).json({ message: "Participant deleted successfully", deletedParticipant });
    }

    res.status(403).json({ message: "Unauthorized to delete this participant" });

  }
  catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
})

module.exports = router;
