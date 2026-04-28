require('dotenv').config();
const mongoose = require('mongoose');
const Institute = require('./models/institute');
const Department = require('./models/department');
const Event = require('./models/event');
const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/frolic";

const check = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const insts = await Institute.find({}, '_id InstituteName');
        const depts = await Department.find({}, '_id DepartmentName');
        const evts = await Event.find({}, '_id EventName');
        const users = await User.find({}, '_id UserName');

        console.log('--- INSTITUTES ---');
        console.log(JSON.stringify(insts, null, 2));
        console.log('--- DEPARTMENTS ---');
        console.log(JSON.stringify(depts, null, 2));
        console.log('--- EVENTS ---');
        console.log(JSON.stringify(evts, null, 2));
        console.log('--- USERS ---');
        console.log(JSON.stringify(users, null, 2));

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

check();
