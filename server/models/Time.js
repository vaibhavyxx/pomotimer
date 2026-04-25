const mongoose = require('mongoose');

const TimeSchema = new mongoose.Schema({
    time: {
        type: Number,
        required: true,
        trim: true,
    },
    owner:{
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

TimeSchema.statics.toAPI = (time) => ({
    time: time.time,
});

const TimeModel = mongoose.model('Time', TimeSchema);
module.exports = TimeModel;