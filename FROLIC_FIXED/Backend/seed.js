require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('./models/user');
const Institute = require('./models/institute');
const Department = require('./models/department');
const Event = require('./models/event');

const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/frolic";

const seed = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("DB Connected.");

     

        // 1. Create Admin User
        const existingAdmin = await User.findOne({ EmailAddress: "admin@frolic.com" });
        let admin;
        if (!existingAdmin) {
            console.log("Creating Admin User...");
            const hashedPassword = await bcrypt.hash("admin123", 10);
            admin = await User.create({
                UserName: "Master Admin",
                UserPassword: hashedPassword,
                EmailAddress: "admin@frolic.com",
                PhoneNumber: "1234567890",
                isAdmin: true
            });
        } else {
            admin = existingAdmin;
            console.log("Admin User already exists.");
        }

        // 2. Create Institute
        console.log("Creating Sample Institute...");
        const institute = await Institute.create({
            InstituteName: "Darshan University",
            InstituteImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
            InstituteDescription: "A leading technical university specializing in engineering and computer science.",
            InstituteCoOrdinatorID: admin._id,
            ModifiedBy: admin._id
        });

        // 3. Create Department
        console.log("Creating Sample Department...");
        const department = await Department.create({
            DepartmentName: "Computer Engineering",
            DepartmentImage: "Laptop", // Using icon name as requested in frontend
            DepartmentDescription: "The hub of coding, algorithms, and digital innovation.",
            InstituteID: institute._id,
            DepartmentCoOrdinatorID: admin._id,
            ModifiedBy: admin._id
        });

        // 4. Create Event
        console.log("Creating Sample Event...");
        await Event.create({
            EventName: "Code-A-Thon 2025",
            EventTagline: "Code your way to the top",
            EventImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            EventDescription: "A 24-hour coding marathon to solve real-world problems. Great prizes for winners!",
            GroupMinParticipants: 1,
            GroupMaxParticipants: 4,
            EventFees: 200,
            EventFirstPrice: 5000,
            EventSecondPrice: 3000,
            EventThirdPrice: 1500,
            DepartmentID: department._id,
            EventCoOrdinatorID: admin._id,
            EventLocation: "Block A - Main Lab",
            MaxGroupsAllowed: 50,
            ModifiedBy: admin._id
        });

        console.log("Seeding Completed Successfully! You can now log in with:");
        console.log("Email: admin@frolic.com");
        console.log("Password: admin123");

        mongoose.connection.close();
    } catch (err) {
        console.error("Error Seeding DB:", err);
        process.exit(1);
    }
};

seed();
