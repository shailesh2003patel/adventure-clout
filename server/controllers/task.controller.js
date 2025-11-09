// server/controllers/task.controller.js
const Task = require('../models/Task');
const User = require('../models/User');

const recalcRank = (points) => {
  if (points >= 300) return 'Master';
  if (points >= 150) return 'Advanced';
  if (points >= 50) return 'Apprentice';
  return 'Novice';
};

exports.createTask = async (req, res) => {
  try {
    const { title, desc, profession, points, difficulty, isBonus } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title is required' });

    const task = await Task.create({
      title,
      desc: desc || '',
      profession: profession || 'general',
      points: typeof points === 'number' ? points : 10,
      difficulty: difficulty || 'easy',
      isBonus: !!isBonus,
      createdBy: req.userId || null
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.listTasks = async (req, res) => {
  try {
    const { profession } = req.query;
    const filter = { active: true };
    if (profession) filter.profession = profession;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('listTasks error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('getTask error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Ensure completedTasks is an array
    if (!Array.isArray(user.completedTasks)) user.completedTasks = [];

    // Prevent duplicate completion
    if (user.completedTasks.some(id => String(id) === String(task._id))) {
      return res.status(400).json({ msg: 'Task already completed' });
    }

    // Award points and update rank
    user.points = (user.points || 0) + (task.points || 0);
    user.completedTasks.push(task._id);
    user.rank = recalcRank(user.points);

    await user.save();

    return res.json({
      msg: 'Task completed',
      points: user.points,
      rank: user.rank,
      taskId: task._id
    });
  } catch (err) {
    console.error('completeTask error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

