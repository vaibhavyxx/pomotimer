const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({username}).exec();
    if(!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

//changes password based on if the old password is correctly entered
AccountSchema.statics.changePassword = async (username, oldPass, newPass, callback) => {
  try{
    const doc = await AccountModel.findOne({username}).exec();
    if(!doc) return callback(new Error('Account not found'));

    const match = await bcrypt.compare(oldPass, doc.password);
    if(!match) return callback(new Error('Current password is incorrect'));

    const hash = await bcrypt.hash(newPass, saltRounds); //saltrounds?
    doc.password = hash;
    await doc.save();

    return callback(null, doc);
  }catch(err){
    return callback(err);
  }
}

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
