// server/routes/tasks.routes.js
const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/task.controller');
const auth = require('../middleware/auth.middleware');

// Public routes
router.get('/', taskCtrl.listTasks);
router.get('/:id', taskCtrl.getTask);

// Authenticated routes
router.post('/', auth, taskCtrl.createTask);
router.post('/:id/complete', auth, taskCtrl.completeTask);

module.exports = router;


