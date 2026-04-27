const Time = require('../models/Time.js');

const makerPage = (req, res) => {
    return res.render('app');
};

const getTime = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Time.find(query).select('time').lean().exec();
        return res.json({time: docs});
    }catch(err){
        return res.status(500).json({error: err});
    }
};

//fetches time value to update the value
const updateTime = async (req, res) => {
    try{
        const time = await Time.findOneAndUpdate(
            {_id: req.params.id, owner: req.session.account._id},
            {time: req.body.time},
            {new: true},
        );
        if(!time){
            return res.status(401).json({error: 'Invalid'});
        }
        return res.status(204).json({status: 'success'});
    }catch(err){
        return res.status(500).json({error: err});
    }
};

module.exports = {makerPage, getTime, updateTime};