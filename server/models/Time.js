const mongoose = require('mongoose');

//ties is the duration of the session and its pomosessions
const TimeSchema = new mongoose.Schema({
    time: {
        type: Number,
        required: true,
        trim: true,
    },
    pomodoro : {
        type: Number,
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