const express = require('express');
const app = express();
const router = express.Router();
const Group = require('../models/Group'); 
const Artist = require('../models/Artist'); 
const ObjectId = require('mongodb').ObjectID;
const {upload, gfs, gridfsBucket} = require('../store/index');
const { mongoose } = require('mongoose');
const passport = require('passport')
const { artistValidationCreate, artistValidationUpdate } = require('../helpers/validation')
const { validationResult } = require('express-validator');

router.get('/', (req, res) => {
    const {page, limit} = req.query;
    
    let filterObj = {}

    if(page !== undefined && limit !== undefined) {
        filterObj = {page, limit} 
    }

    Artist
    .paginate({}, filterObj)
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(422).json({success: false, err: err});
    })
});

router.get('/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)) {
        Artist
        .findOne({_id: req.params.id})
        .then((artist) => {
            if(artist !== null) {
                res.status(200).json(artist)
            }
            else {
                res.status(404).json({success: false, err: err})
            }
        })
        .catch((err) => {
            res.status(404).json({succes: false, err: err});
        })
    }
    else {
        res.status(404).json({succes: false, err: err});
    }
});

router.post('/', passport.authenticate('jwt', {session: false}), upload.single('file'), artistValidationCreate, (req, res) => {
    const arrayImageType = ['image/jpeg', 'image/png']
    const errors = validationResult(req);

    if(req.file === undefined) {
        //req.file.size === 0
        errors.errors.push({value: "", msg: "File should not be Empty.", param: "file", location: "body"})
    }

    if((req.file !== undefined) && arrayImageType.includes(req.file.mimeType)) {
        //req.file.size === 0
        errors.errors.push({value: "", msg: "File should be in jpeg or png format.", param: "file", location: "body"})
    }

    let err = {}

    for(let i = 0; i < errors.errors.length; i++) {
        err[errors.errors[i].param] = [errors.errors[i].msg]
    }

    if(!errors.isEmpty()) {
        // delete img
        if(req.file !== undefined) {
            gfs.grid.remove({_id : req.file.id, root: 'image'}, (err, gridStore) => {
                res.status(422).json({success: false})
            })
        }
        else {
            res.status(422).json({success: false, err})
        }
    }
    else {
        if(req.file !== undefined) {
            var newArtist = new Artist({
                ... req.body,
                profileImage: ObjectId(req.file.id),
                profileImageLink: `http://localhost:8000/images/${req.file.id}`,
                author: ObjectId(req.user._id)
            })

            newArtist.save()
            .then((artist) => {
                res.status(200).json(artist)
            })
            .catch((err) => {
                res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})               
            })
        }
        else {
            res.status(422).json({success: false, err: 'Form has Errors. Please fix these.'})
        }
    }
})

router.put('/:id', upload.single('file'), artistValidationUpdate, (req, res) => {
    const arrayImageType = ['image/jpeg', 'image/png']
    const errors = validationResult(req);

    if(req.file !== undefined && arrayImageType.includes(req.file.mimeType)) {
        //req.file.size === 0
        errors.errors.push({value: "", msg: "File should be in jpeg or png format.", param: "file", location: "body"})
    }

    let err = {}

    for(let i = 0; i < errors.errors.length; i++) {
        err[errors.errors[i].param] = [errors.errors[i].msg]
    }

    if(!errors.isEmpty()) {
        // delete img
        if(req.file !== undefined) {
            gfs.grid.remove({_id : req.file.id, root: 'image'}, (err, gridStore) => {
                res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
            })
        }
        res.status(422).json({success: false, err})
    }

    let update = {
        ...req.body
    };

    if(req.file !== undefined) {
        update.profileImage = ObjectId(req.file.id),
        update.profileImageLink = `http://localhost:8000/images/${req.file.id}`
    }

    Artist
    .findOneAndUpdate({_id: req.params.id}, update)
    .then((oldArtist) =>  {
        if(req.file === undefined) {
            res.status(200).json({success: true})
        }

        // delete old img
        if(req.file !== undefined) {
            gfs.grid.remove({_id : oldArtist.profileImage, root: 'image'}, (err, gridStore) => {
                res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
            })
        }
    })
    .catch((err) => {
        res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
    })
});

router.delete('/:id', (req, res) => {
    // get group
    Artist
    .findOne({_id: req.params.id})
    .then((artist) => { 
        if(artist === null) {
            res.status(404).json({success: false})
        }

        // delete Artist in list artists and formerArtists of group
        const deleteArtistInGroup = new Promise((resolve, reject) => {

            let filter = { $or: [ {artists: ObjectId(req.params.id)}, {formerArtists: ObjectId(req.params.id)}]}
            let update = {$pull: {artists: ObjectId(req.params.id), formerArtists: ObjectId(req.params.id)}}

            Group
            .updateMany(filter, update)
            .then((result) => {
                resolve()                                                     
            })
            .catch((err) => {
                reject()
            })
        })

        // delete pic 
        const deleteImage = new Promise((resolve, reject) => {
            gfs.grid.remove({_id : artist.profileImage, root: 'image'}, (err, gridStore) => {
                resolve()
            })
        })

        const deleteArtist = new Promise((resolve, reject) => {
            // delete Artist 
            Artist
            .findOneAndDelete({_id: req.params.id})
            .then(() => { 
                resolve()
            })
        })

        Promise
        .all([deleteArtist, deleteImage, deleteArtistInGroup])
        .then(values => {
            res.status(200).json({success: true})
        }) 
        .catch((err) => {
            res.status(422).json({success: false})
        })
    })
})
 
module.exports = router; 