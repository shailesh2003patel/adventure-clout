// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: String,
      enum: ['Novice', 'Apprentice', 'Advanced', 'Master'],
      default: 'Novice',
    },
    completedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    // optional: for profile info (future expansion)
    
  },
  { timestamps: true }
);

// Optionally calculate rank dynamically based on points
UserSchema.methods.recalculateRank = function () {
  const pts = this.points || 0;
  if (pts >= 300) this.rank = 'Master';
  else if (pts >= 150) this.rank = 'Advanced';
  else if (pts >= 50) this.rank = 'Apprentice';
  else this.rank = 'Novice';
  return this.rank;
};

module.exports = mongoose.model('User', UserSchema);

