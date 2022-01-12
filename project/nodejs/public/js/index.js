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
const upload = multer();
const fs = require('fs');
const {promisify} = require('util');
const pipelline = promisify(require('stream').pipeline)



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

let gfs;

/***************************************/
/*              MongoDB                */
/***************************************/

// mongoose.set('debug', true);

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(keys.mongoURIDevelopment);

// process.exit();

    const conn = mongoose.createConnection(mongoURIDevelopment, { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });

    conn.once('open', () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads');
    });

    const storage = new GridFsStorage({
        url: mongoURIDevelopment,
        file: (req, file) => {
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
              };
              resolve(fileInfo);
            });
          });
        }
      });
      //const upload = multer({ storage });

    /*
    console.log(keys.mongoURIDevelopment)
    // connection with Database
    mongoose.connect(
                mongoDB, 
                { 
                    useNewUrlParser: true,
                    useUnifiedTopology: true 
                }
            ) 
            .then(() => {
                console.log('Succeeded connected to: ' + mongoDB + '.')
            })
            .catch(err => console.log(err))
    */
//}

/***************************************/ 
/*                REST                 */ 
/***************************************/ 

app.post('/upload', upload.single('file'), async (req, res, next) => {
    console.log('in upload');

    const {
        file, body
    } = req;

    if(file.detectedFileExtension !== '.jpg') next(new Error('invalide file'))

    const fileName = 'img' + file.detectedFileExtension

    await pipelline(file.stream, fs.createWriteStream(`${__dirname}/../public/images/${fileName}`))

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