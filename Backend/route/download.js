const express = require("express");
const router = express.Router();
const File = require('../module/file')


router.get('/:uuid',async(req,res)=>{
    const file = await File.findOne({uuid:req.params.uuid})
    if(!file){
        return res.status(404).json({ error: 'Link has expired' });
    }
    console.log(file.path)
    const filePath = `${__dirname}/../${file.path}`
    res.download(filePath);
})


module.exports = router