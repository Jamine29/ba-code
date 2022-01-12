// Modles
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./configs/keys.js');

const path = require('path');
const crypto = require('crypto');
//const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { mongoURIDevelopment } = require('./configs/keys.js');

const multer = require('multer');
const fs = require('fs');
const {promisify} = require('util');
const pipelline = promisify(require('stream').pipeline)

const { GridFSBucket, MongoClient } = require('mongodb');
//import { Readable } from 'stream';


// middleware
app.use(methodOverride('_method'));
app.use(express.static('public'))
app.use(
    bodyParser.urlencoded({ 
        extended: false 
    })
);
app.use(bodyParser.json());

// caused =>  Error: Not allowed by CORS while running the test
// This is CORS-enabled for a whitelisted domain.
var whitelist = ['http://localhost:3000', undefined];

var corsOptions = {
    origin: function (origin, callback) {
        // indexOf return -1 when value is not in the array
        if(whitelist.indexOf(origin) !== -1) {
            // callback(error, response)
            callback(null, true);
        } 
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    }
};
 
app.use(cors(corsOptions));

/***************************************/
/*              MongoDB                */
/***************************************/

// mongoose.set('debug', true);
// process.exit();

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://admin:admin@cluster0.et8oi.mongodb.net/database');

const conn = mongoose.connection;

//init gfs
let gfs;
let gridfsBucket;

conn.once('open', () => {
    console.log('connnect')
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('image'); 

    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
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

/***************************************/ 
/*                REST                 */ 
/***************************************/ 

const Artist = require('./models/Artist')

/*
connection.db.collection("media.files").find().toArray((err, files) => {
      // Return the files that exist.
      return res.json(files);
})
*/

app.post('/upload', upload.single('file'), async (req, res, next) => {
    
    console.log('in upload');
    console.log(req.file);

    const {
        file, body
    } = req;

    //if(file.detectedFileExtension !== '.jpg') next(new Error('invalide file'))

    //const fileName = 'img' + file.detectedFileExtension

    //await pipelline(file.stream, fs.createWriteStream(`${__dirname}/../public/images/${fileName}`))

    //console.log(req.body.file.length)
    /*
    for( let i = 0; i < req.body.file.length; i++ ){
        console.log(typeof req.body.file)
    }
    console.log('jn')
    */
    //res.json({file: req.file})
    //console.log(req.body)
    // nconsole.log(req.file)

    res.send('Hello')
});

//const ObjectId = require('mongodb').ObjectID;

app.get('/images/:id', (req, res) => {
    console.log('in image')
    gfs.files.findOne({_id : mongoose.Types.ObjectId('60532d05d595fc11e097c67f')}, (err, file) => {
        console.log(file)
        const readstream = gridfsBucket.openDownloadStream(mongoose.Types.ObjectId('60532d05d595fc11e097c67f'));
        readstream.pipe(res);
    })

/*
    console.log('many')
    gfs.files.find({}).toArray((err, file) => {
        console.log(file)
    })
*/

    //const readstream = gridfsBucket.openDownloadStream('60532d05d595fc11e097c67f');
    //readstream.pipe(res);

    /*
    // {'_id': ObjectId('6052164f65581a360876241f')}
    gfs.collection('image.files').findOne({'_id': ObjectId('605324ffc73d5308809125cd')}, (err, file) => {
        //
        for(let i = 0; i < file.length; i++) {
            console.log(file[i]._id)
            gridfsBucket.delete({_id: ObjectId(file[i]._id)}, function(error){
                console.log('err')
                console.log(error)
          })
        }
        //

        console.log(file)
        if(file) {
            //console.log(file[0].filename)
            console.log('not null')
            if(!file || file.length === 0){
                console.log('in 404')
                return res.status(404).json({err: 'No File Exists'});
            } else {
                console.log('type')
                // Check if is image
                if(file.contentType === "image/jpeg" || file.contentType === "image/png"){
                    console.log('jo')
                    // Read output to broswer
                    //const readstream = gfs.createReadStream(file.filename);
                    const readstream = gridfsBucket.openDownloadStream(ObjectID('605324ffc73d5308809125cd'));
                    readstream.pipe(res);
                } else {
                    res.status(404).json({err: 'Not and image'});
                }
            }
        }
        if (file === null) res.status(404).json({err: 'Not and image'});
    });
    */
});

app.use('/members', require('./routes/artist'));  

/*
app.use('/', (req, res) => {
    res.type('text/plain').status(200).send('200: Hello.');
});
*/

app.use(function(req, res) {
    console.log('hiers')
    res.type('text/plain').status(404).send('404: Page not Found.');
});


/***************************************/
/*               Server                */
/***************************************/

const port = process.env.PORT || 8000;

// start server
const server = app.listen(port, () => console.log(`App listening on port: ${port}`));

module.exports = app;