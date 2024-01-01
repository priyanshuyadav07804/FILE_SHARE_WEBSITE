const express = require("express");
const router = express.Router();
const multer = require("multer");
const File = require("../module/file");
const path = require("path");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

let upload = multer({
    storage,
    limit: { fileSize: 100 * 1024 },
}).single("myfile");

router.post("/",(req, res) => {
    //store file
    upload(req, res, async (err) => {
        //validate request
        if (!req.file) {
            return res.json({ error: "All fields are required" });
        }

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        //store into database
        const file = new File({
            filename: req.file.filename, //uniquename
            uuid: uuid4(),
            path: req.file.path, //destination + filename of multer
            size: req.file.size,
        });
        const response = await file.save();
        return res.json({ file: `${process.env.BASE_URL}/files/${response.uuid}` });
    });
});

router.post('/send',async(req,res)=>{
    const {uuid,emailTo,emailFrom} = req.body
    console.log(req.body)

    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error:"All fields are required"})
    }
    
    const file = await File.findOne({uuid})
    if(file.sender){
        return res.status(422).send({error:"Email Aleady Sent"})
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save()


    //send email

    const sendMail = require('../services/mailService')
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:"File Sharing",
        text: `${emailFrom} shared file with you.\n File size: ${parseInt(file.size / 1000)} KB. \n Expires in 24 hours.\n Download link: ${process.env.BASE_URL}/files/${file.uuid}.`,
        // html:require('../services/emailTemplate')({
        //     emailFrom:emailFrom,
        //     downloadLink:`${process.env.BASE_URL}/files/${file.uuid}`,
        //     size:parseInt(file.size/1000)+'KB',
        //     expires : `24 hours`
        // })
    })
    res.status(200).json("email send Successfully")

})

module.exports = router;
