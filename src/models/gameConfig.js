import mongoose from 'mongoose';

const gameConfigSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    gameId: { type: Number, required: true },
    resolution: { width: Number, height: Number },
    graphicsQuality: { type: String, enum: ['Low', 'Medium', 'High', 'Ultra'], default: 'Medium' },
    frameRateLimit: { type: Number, default: 60 }
}, { timestamps: true });

export default mongoose.model('gameConfig', gameConfigSchema);