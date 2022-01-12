const express = require('express');
const app = express();
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const {upload, gfs, gridfsBucket} = require('../store/index');
const mongoose = require('mongoose')

router.get('/:id', (req, res) => {
    gfs.grid.files.findOne({_id : ObjectId(req.params.id)}, (err, file) => {
        const readstream = gridfsBucket.bucket.openDownloadStream(ObjectId(req.params.id));
        readstream.pipe(res);
    })
});

module.exports = router; 