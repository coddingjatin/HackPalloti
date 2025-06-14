const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  learningParameters: {
    learningStyle: {
      type: String,
    },
    timeCommitment: {
      type: Number,
    },
    domainInterest: {
      type: [String],
    },
    preferredDifficulty: {
      type: String,
    },
  },
  isAssessmentComplete: {
    type: Boolean,
    default: false,
  },
  surveyParameters: {
    visualLearning: {
      type: Number,
    },
    auditoryLearning: {
      type: Number,
    },
    readingWritingLearning: {
      type: Number,
    },
    kinestheticLearning: {
      type: Number,
    },
    challengeTolerance: {
      type: Number,
    },
    timeCommitment: {
      type: Number,
    },
    learningPace: {
      type: Number,
    },
    socialPreference: {
      type: Number,
    },
    feedbackPreference: {
      type: Number,
    },
  },
  avg_quiz_score: {
    type: Number,
    default: 0,
  },
  quizzes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    default: [],
  },
  roadmaps: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Roadmap",
      },
    ],
    default: [],
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  dateJoined: {
    type: Date,
  },
});

userSchema.statics.createUser = async function (name, email, password) {
  try {
    const user = new this({ name, email, password });
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserByEmail = async function (email) {
  try {
    const user = await this.findOne({ email });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.addRoadmap = async function (userId, roadmapId) {
  try {
    const user = await this.findById(userId);
    user.roadmaps.push(roadmapId);
    await user.save();
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUsersRoadmaps = async function (userId) {
  try {
    const user = await this.findById(userId).populate({
      path: "roadmaps",
      populate: {
        path: "checkpoints",
        populate: {
          path: "resources",
          model: "Resource",
        },
      },
    });

    return user.roadmaps;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
