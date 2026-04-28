const Time = require('../models/Time.js');

const makerPage = (req, res) => {
    return res.render('app');
};

const getTime = async (req, res) => {
     try {
        const doc = await Time.findOne({ owner: req.session.account._id });
        return res.json({ time: doc ? doc.time : 25 * 60 });  
    } catch(err) {
        return res.status(500).json({ error: err });
    }
};

//fetches time value to update the value
const updateTime = async (req, res) => {
    try{
        //console.log(`req body: ${req.body}, time: ${req.body.time}`);
        const time = await Time.findOneAndUpdate(
            {_id: req.params.id, owner: req.session.account._id},
            {time: req.body.time},
            {new: true, upsert: true},
        );
        return res.status(204).json({status: 'success'});
    }catch(err){
        return res.status(500).json({error: err});
    }
};

module.exports = {makerPage, getTime, updateTime};