const express = require('express');
const app = express();

const mongoose = require('mongoose')
const path = require('path');
const crypto = require('crypto');
//const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { mongoURIDevelopment } = require('../configs/keys.js');

const multer = require('multer');
const fs = require('fs');
const {promisify} = require('util');
const pipelline = promisify(require('stream').pipeline)

const { GridFSBucket, MongoClient } = require('mongodb');
//import { Readable } from 'stream';

app.use(express.static('public'))

/***************************************/
/*              MongoDB                */
/***************************************/

mongoose
    .connect('mongodb+srv://admin:admin@cluster0.et8oi.mongodb.net/database', { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('MongoDB Connected');   
    })
    .catch((err) => {
        console.log('Error conecting to MongoDB')
        console.log(err)
        process.exit();
    });

const conn = mongoose.connection;

//init gfs
let gfs = {grid: undefined};
let gridfsBucket = {bucket: undefined};

conn.once('open', () => {
    gfs.grid = Grid(conn.db, mongoose.mongo);
    gfs.grid.collection('image'); 

    gridfsBucket.bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'image'
    })
});

const storage = new GridFsStorage({
    url: 'mongodb+srv://admin:admin@cluster0.et8oi.mongodb.net/database',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
            //const filename = buf.toString('hex') + path.extname(file.originalname);
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: 'image'
            };
            resolve(fileInfo);
        });
      });
    }
});

const upload = multer({ storage });

/*
module.exports.upload = upload;
module.exports.gfs = gfs;
module.exports.gridfsBucket = gridfsBucket;
*/

module.exports = {
    gfs,
    gridfsBucket,
    upload,
}