//const models = require('../models');
//const Account = models.Account;
const Account = require('../models/Account.js');

const loginPage = (req, res) => {
    return res.render('login');
};

const logout = (req, res) => {
    req.session.destroy();  //every request will have a session object
    return res.redirect('/');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if(!username || !pass){
        return res.status(400).json({error: 'All fields are required!'});
    }

    return Account.authenticate(username, pass, (err, account) => { //getting an error here
        if(err || !account){
            return res.status(401).json({error: 'Wrong username or password'});
        }
        req.session.account = Account.toAPI(account);
        req.session.save(() => {
            return res.json({redirect: '/maker'});
        });
    });
};

const renderWelcome = (req, res) => {
    return res.render('maker', {
        username: req.session.account.username,
    });
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if(!username || !pass || !pass2){
        return res.status(400).json({error: 'All fields are required!'});
    }

    if(pass != pass2){
        return res.status(400).json({error: 'Passwords do not match!'});
    }

    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        
        req.session.save(() => {
            return res.json({redirect: '/maker'});
        });
    }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'username is already in use!'});
        }
        return res.status(500).json({error: 'An error occured!'});
    }
};

module.exports = {loginPage, login, logout, signup, renderWelcome};