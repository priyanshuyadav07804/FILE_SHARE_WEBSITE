const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    sender: { type: String, required: false },
    receiver: { type: String, required: false },
}, { timestamps: true });

// Index for automatic expiration after 24 hours
fileSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 }); // 24 hours in seconds

const File = mongoose.model('file', fileSchema);

module.exports = File;
