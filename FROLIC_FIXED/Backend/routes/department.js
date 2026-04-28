const express = require('express');
const router = express.Router();
const Department = require("../models/department");
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnlyMiddleware');
const Institute = require('../models/institute');
const mongoose = require("mongoose");


router.get("/", async (req, res) => {
    try {
        const departments = await Department.find().populate("InstituteID", "InstituteName");

        res.status(200).json({ departments });
    }
    catch (err) {
        console.error("GET / departments error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

router.get("/:instituteId/departments", async (req, res) => {
    try {
        const { instituteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(instituteId)) {
            return res.status(400).json({ message: "Invalid institute ID" });
        }

        const instituteExists = await Institute.findById(instituteId);
        if (!instituteExists) {
            return res.status(404).json({ message: "Institute not found" });
        }

        const departments = await Department.find({
            InstituteID: instituteId
        }).populate("DepartmentCoOrdinatorID", "UserName EmailAddress").select("-__v");

        res.status(200).json({ departments });
    }
    catch (err) {
        console.error("GET / departments error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { DepartmentName, DepartmentImage, DepartmentDescription, InstituteID, DepartmentCoOrdinatorID } = req.body;

        if (!DepartmentName || !InstituteID || !DepartmentCoOrdinatorID) {
            return res.status(400).json({ message: "DepartmentName, InstituteID and DepartmentCoOrdinatorID are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(InstituteID) || !mongoose.Types.ObjectId.isValid(DepartmentCoOrdinatorID)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }

        const institute = await Institute.findById(InstituteID);
        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        const isAdmin = req.user.isAdmin;
        const isCoordinator = req.user.isCoordinator;
        const isInstituteCoOrdinator = institute.InstituteCoOrdinatorID.toString() === req.user.id;

        if (!isAdmin && !isCoordinator && !isInstituteCoOrdinator) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const department = await Department.create({
            DepartmentName,
            DepartmentImage,
            DepartmentDescription,
            InstituteID,
            DepartmentCoOrdinatorID,
            ModifiedBy: req.user.id
        });

        res.status(200).json({ message: "Department registered successfully", department });
    }
    catch (err) {
        console.error("GET / departments error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Department ID" });
        }

        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        const isAdmin = req.user.isAdmin;
        const isCoordinator = req.user.isCoordinator;
        const isDepartmentCoOrdinator = department.DepartmentCoOrdinatorID.toString() === req.user.id;

        if (!isAdmin && !isCoordinator && !isDepartmentCoOrdinator) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const allowedFields = [
            "DepartmentName",
            "DepartmentImage",
            "DepartmentDescription",
            "DepartmentCoOrdinatorID"
        ];

        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.DepartmentCoOrdinatorID && !mongoose.Types.ObjectId.isValid(updates.DepartmentCoOrdinatorID)) {
            return res.status(400).json({ message: "Invalid Department Coordinator ID" });
        }

        updates.ModifiedBy = req.user.id;

        const updatedDepartment = await Department.findByIdAndUpdate(id,
            {
                $set: updates
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Department Updated", updatedDepartment });
    }
    catch (err) {
        console.error("GET / departments error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const isAdmin = req.user.isAdmin;
        const isCoordinator = req.user.isCoordinator;
        
        if (!isAdmin && !isCoordinator) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Department ID" });
        }

        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        // 1. Delete all Events in this department
        const Event = require("../models/event");
        await Event.deleteMany({ DepartmentID: id });

        // 2. Delete the Department
        await Department.findByIdAndDelete(id);

        res.status(200).json({ message: "Department and its events deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;