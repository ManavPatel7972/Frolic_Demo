const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminOnlyMiddleware = require("../middleware/adminOnlyMiddleware");
const Institute = require("../models/institute");


router.get("/", async (req, res) => {
    try {
        const institutes = await Institute.find();

        res.status(200).json({ institutes });
    }
    catch (err) {
        console.error("GET / Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);

        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        res.status(200).json({ institute });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post("/", authMiddleware, adminOnlyMiddleware, async (req, res) => {
    try {
        const { InstituteName, InstituteImage, InstituteDescription, InstituteCoOrdinatorID } = req.body;

        if (!InstituteName || !InstituteCoOrdinatorID) {
            return res.status(400).json({ message: "InstitureName and InstituteCoOrdinatorID are required" });
        }

        const institute = await Institute.create({
            InstituteName,
            InstituteImage,
            InstituteDescription,
            InstituteCoOrdinatorID,
            ModifiedBy: req.user.id
        });

        res.status(200).json({ message: "Institute created successfully", institute });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.patch("/:id", authMiddleware, adminOnlyMiddleware, async (req, res) => {
    try {
        const institute = await Institute.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {
                new: true
            }
        );

        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        res.status(200).json({ message: "Institute updated successfully", updatedInstitute: institute });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.delete("/:id", authMiddleware, adminOnlyMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const institute = await Institute.findById(id);

        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        // 1. Find all departments in this institute
        const Department = require("../models/department");
        const Event = require("../models/event");
        const departments = await Department.find({ InstituteID: id });
        const deptIds = departments.map(d => d._id);

        // 2. Delete all events in those departments
        await Event.deleteMany({ DepartmentID: { $in: deptIds } });

        // 3. Delete all departments
        await Department.deleteMany({ InstituteID: id });

        // 4. Delete the institute
        await Institute.findByIdAndDelete(id);

        res.status(200).json({ message: "Institute and all its related content deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;