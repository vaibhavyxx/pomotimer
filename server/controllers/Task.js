const Task = require('../models/Task.js');

const makerPage = (req, res) => {
    return res.render('app');
};

const getTask = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Task.find(query).select('task').lean().exec();
        return res.json({task: docs});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving tasks'});
    }
};

const addTask = async (req, res) => {
    if(!req.body.task){
        return res.status(400).json({error: 'Missing paramters'});
    }

    const taskData = {
        task: req.body.task,
        owner: req.session.account._id,
    };

    try{
        const newTask = new Task(taskData);
        await newTask.save();
        return res.status(201).json({task: newTask.task});

    }catch(err){
        console.log(err);
        /*if(err.code === 11000){
            return res.status(400).json({error: 'Domo already exists!'});
        }*/
        return res.status(500).json({error: 'An error occured making demo!'});
    }
}

module.exports = {makerPage, getTask, addTask,};