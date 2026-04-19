/*const Image = require('../models/Image.js');

const uploadPage = (req, res) => {
    res.render('upload');
};

//Ensurs users are uploading files
const uploadFile = async (req, res) => {
    if(!req.files || !req.files.sampleFile){
        return res.status(400).json({error:'No files were uploaded'});
    }
    const {sampleFile} = req.files;
    /*try{
        const newFile = new Image(sampleFile);
        const doc = await newFile.save();
        return res.status(201).json({
            message: 'File stored succesfully',
            fileId: doc._id,
        });
    }catch(err){
        return res.status(400).json({
            error: 'Something went wrong uploading this file!',
        });
    }
}
module.exports = {
    uploadFile, uploadPage,
};*/