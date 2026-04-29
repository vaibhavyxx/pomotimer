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

    return Account.authenticate(username, pass, (err, account) => { 
        if(err || !account){
            return res.status(401).json({error: 'Wrong username or password'});
        }
        req.session.account = Account.toAPI(account);
        req.session.save(() => {
            return res.json({redirect: '/todo'});
        });
    });
};

const getUserInfo = (req, res) => {
    return res.render('pro', {    
        username: req.session.account.username,
    });
};

const paidAccount = async (req, res) => {
    const username = req.session.account.username;
    //automatically turns it into a paid account
    try{
        const account = await Account.findOneAndUpdate(
            {_id: req.params.id, owner: req.session.account.username},
            {paid: true},
            {new: true},
        );
        if(!account)
            return res.status(404).json({ error: 'Account not found' });
        return res.status(204).json({ status: 'success' });
    }catch(err){
        return res.status(500).json({ error: err });
    }
}

//functionality for the logged in user to change their password
const changePassword = async (req, res) => {
    const pass1 = `${req.body.pass1}`;
    const pass2 = `${req.body.pass2}`;
    const oldPass = `${req.body.oldPass}`;

    if(!pass1 ){
            return res.status(400).json({error: 'Enter the new password'});
        }
        else{
            if(!pass2){
                return res.status(400).json({error: 'Retype the new password'});
            }
        }
        if(pass1 !== pass2){
            return res.status(400).json({error: 'Password do not match!'});
        }
    return Account.changePassword(req.session.account.username, oldPass, pass1, (err) => {
        if(err) return res.status(400).json({error: err.message});
        return res.json({message: 'Password changed successfully'});
    });
}

const renderPasswordChangePage = (req, res) => {
    return res.render('changePassword');
};

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;
    //By default everyone has a free account

    if(!username || !pass || !pass2){
        return res.status(400).json({error: 'All fields are required!'});
    }

    if(pass != pass2){
        return res.status(400).json({error: 'Passwords do not match!'});
    }

    try{
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({username, password: hash, paid: false});
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        
        req.session.save(() => {
            return res.json({redirect: '/todo'});
        });
    }catch(err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({error: 'username is already in use!'});
        }
        return res.status(500).json({error: 'An error occured!'});
    }
};

module.exports = {loginPage, login, logout, signup, changePassword, renderPasswordChangePage, getUserInfo, paidAccount};