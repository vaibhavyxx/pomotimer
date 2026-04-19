const Domo = require('../models/Domo.js');

const makerPage = (req, res) => {
    return res.render('app');
};

const getDomos = async (req, res) => {
    try{
        const query = {owner: req.session.account._id};
        const docs = await Domo.find(query).select('name age creature').lean().exec();
        return res.json({domos: docs});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Error retrieving domos!'});
    }
};

const makeDomo = async (req, res) => {
    if(!req.body.name || !req.body.age || !req.body.creature){
        return res.status(400).json({error: 'Missing paramters: name, age and creature are required!'});
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        creature: req.body.creature,
        owner: req.session.account._id,
    };

    try{
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age, creature: newDomo.creature});
        //return res.json({redirect: '/maker'});
    }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'Domo already exists!'});
        }
        return res.status(500).json({error: 'An error occured making demo!'});
    }
}

module.exports = {makerPage, makeDomo, getDomos,};