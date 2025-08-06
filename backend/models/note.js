// server/models/userHealthData.model.js
import mongoose from "mongoose";

const userHealthDataSchema = new mongoose.Schema({
    clerkUserId: {
        type: String, // Clerk's unique identifier for each user
        required: true,
        index: true,
    },
    name: {
        type: String, // free text (can be interpreted by AI)
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String, // true = yes, false = no
        required: true,
    },

    weight: {
        type: Number, // in kg
        required: true,
    },
    height: {
        type: Number, // in cm
        required: true,
    },
    goalWeight: {
        type: Number, // in kg
        required: true,
    },
    healthConditions: {
        type: [String], // e.g., ["Diabetes", "Asthma"]
        default: [],
    },
    dailyActivityLevel: {
        type: String,
        enum: [ "sedentary", "light", "moderate", "high"],
        required: true,
    },
    wantsGym: {
        type: Boolean, // true = yes, false = no
        required: true,
    },
    endGoal: {
        type: String,
        enum: ["muscle gain", "fitness", "weight loss", "weight gain", "other"],
        required: true,
    },
    currentDiet: {
        type: String, // free text (can be interpreted by AI)
        required: true,
    },
    isVegetarian: {
        type: Boolean, // true = vegetarian, false = non-vegetarian
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dietPlan: {
        type: String, // free text (can be interpreted by AI)
        // required: true,
    },
    gymPlan: {
        type: String, // free text (can be interpreted by AI)
        // required: true,
    },
    m_cal: {
        type: Number, //maintainance calories
    }
});

const UserHealthData = mongoose.model("UserHealthData", userHealthDataSchema);

export default UserHealthData;