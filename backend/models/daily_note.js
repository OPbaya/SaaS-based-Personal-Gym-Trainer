import mongoose from 'mongoose';

const dailyEntrySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // Clerk user ID
    },
    date: {
        type: Date,
        required: true,
    },
    bodyWeight: {
        type: Number, // in kg
        required: true,
    },
    caloriesConsumed: {
        type: Number, // kcal
    },
    caloriesBurned: {
        type: Number, // kcal
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Prevent duplicate entries for same user & date
dailyEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const dailyEntry =  mongoose.model('DailyEntry', dailyEntrySchema);

export default dailyEntry;