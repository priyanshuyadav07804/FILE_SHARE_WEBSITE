const express = require("express");
const router = express.Router();
const File = require('../module/file')

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.status(404).json({ error: 'Link has expired' });
        }

        return res.status(200).json({
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.BACKEND_URL}/files/download/${file.uuid}`,
            error: null
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router