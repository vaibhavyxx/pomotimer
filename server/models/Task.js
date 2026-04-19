const mongoose = require('mongoose');
const _ = require('underscore');

const TaskScheme = new mongoose.Schema({
    task: {
        type: String,
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

TaskScheme.statics.toAPI = (task) => ({
    task: task.task,
});

const TaskModel = mongoose.model('Task', TaskScheme);
module.exports = TaskModel;