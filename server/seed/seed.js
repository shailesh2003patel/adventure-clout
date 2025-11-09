// server/seed/seed.js
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Task.deleteMany({});

  const hashed = await bcrypt.hash('password', 10);
  const demoUser = await User.create({
    username: 'demo',
    email: 'demo@local',
    password: hashed,
    points: 0
  });

  await Task.insertMany([
    { title: 'Verify Profile', desc: 'Upload ID to get verified.', points: 50, isBonus: true },
    { title: 'First Post', desc: 'Create your first profile post.', points: 10 },
    { title: 'Invite Friend', desc: 'Invite a friend to join.', points: 30 }
  ]);

  console.log('✅ Seed done!');
  process.exit(0);
};

seed();
