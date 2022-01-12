const express = require('express');
const router = express.Router();
const Group = require('../models/Group'); 
const Artist = require('../models/Artist')
const ObjectId = require('mongodb').ObjectID;
const {upload, gfs, gridfsBucket} = require('../store/index');
const passport = require('passport')
const { groupValidationCreate, groupValidationUpdate } = require('../helpers/validation')
const { validationResult } = require('express-validator');

router.get('/', (req, res) => {
    const {page, limit} = req.query;

    let filterObj = {}

    if(page !== undefined && limit !== undefined) {
        filterObj = {page, limit} 
    }

    Group
    .paginate({}, filterObj)
    .then((group) => {
        res.status(200).json(group)
    })
    .catch((err) => {
        res.status(422).json({success: false})
    })
});

router.get('/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id)) {
        Group
        .findOne({_id: req.params.id})
        .then((group) => {
            if(group === null) {
                res.status(404).json({success: false})
            }

            let activeArtists = [];
            let formerArtists = [];

            let activeArtistsMap = new Promise((resolve, reject) => {

                if(group.artists.length === 0) resolve();

                group.artists.map((artistId, index) => {
                    Artist
                    .findOne({_id: artistId})
                    .then((artist)=>{
                        if(artist !== null) {
                            activeArtists.push(artist)
                        }
                        if(group.artists.length-1 === index) {
                            resolve();
                        }
                    })
                    .catch((err) => {
                        reject()
                    })
                })
            })

            let formerArtistsMap = new Promise((resolve, reject) => {
            
                if(group.formerArtists.length === 0) {
                    resolve()
                }

                group.formerArtists.map((formerArtistId, index) => {
                    Artist
                    .findOne({_id: formerArtistId})
                    .then((artist)=>{
                        if(artist !== null) {
                            formerArtists.push(artist)
                        }
                        if(group.formerArtists.length-1 === index) {
                            resolve()
                        }
                    })
                    .catch(() => {
                        reject()
                    })
                })
            })

            Promise
            .all([activeArtistsMap, formerArtistsMap])
            .then((values) => {   
                res.json({
                    ...group._doc,
                    artists: {
                        docs: activeArtists
                    },
                    formerArtists: {
                        docs: formerArtists
                    }
                });
            }) 
            .catch((err) => {
                res.status(404).json({success: false})
            })
        })
    }
    else {
        res.status(404).json({success: false})
    }
});

router.post('/', passport.authenticate('jwt',{session: false}), upload.single('file'), groupValidationCreate, (req, res) => {
    const arrayImageType = ['image/jpeg', 'image/png']

    const errors = validationResult(req);

    if(req.file === undefined || req.file.size === 0) {
        errors.errors.push({value: "", msg: "File should not be Empty.", param: "file", location: "body"})
    }

    if((req.file === undefined || req.file.size !== 0) && arrayImageType.includes(req.file.mimeType)) {
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
                if (err) {
                    res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
                }
                res.status(200).json({success: true})
            })
        }
        res.status(422).json({success:false, err})
    }

    if(req.file !== undefined) {
        let arrArtists = JSON.parse(req.body.artists)
        let arrFormerArtists = JSON.parse(req.body.formerArtists)

        let arrArtistsObjectIds = []
        let arrFormerArtistsObjectIds = []

        for(let artist in arrArtists) {
            arrArtistsObjectIds.push(ObjectId(arrArtists[artist].value))
        }

        for(let formerArtist in arrFormerArtists) {
            arrFormerArtistsObjectIds.push(ObjectId(arrFormerArtists[formerArtist].value))
        }

        let newGroup = new Group({
            ...req.body,
            groupImage: ObjectId(req.file.id),
            groupImageLink: `http://localhost:8000/images/${req.file.id}`,
            artists: arrArtistsObjectIds,
            formerArtists: arrFormerArtistsObjectIds,
            artistsV: arrArtists,
            formerArtistsV: arrFormerArtists,
            author: req.user._id
        })
        
        newGroup.save()
        .then((group) => {
            res.status(200).json(group)
        })
        .catch((err) => {
            res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
        })
    }
    else{
        res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
    }
});

router.put('/:id', upload.single('file'), groupValidationUpdate, (req, res) => {
    const arrayImageType = ['image/jpeg', 'image/png'] 

    const errors = validationResult(req);

    if(req.file !== undefined && req.file.size !== 0 && arrayImageType.includes(req.file.mimeType)) {
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
                if (err) {
                    res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
                }
                res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
            })
        }

        res.status(422).json({success: false, err})
    }

    let arrArtists = JSON.parse(req.body.artists)
    let arrFormerArtists = JSON.parse(req.body.formerArtists)

    let arrArtistsObjectIds = []
    let arrFormerArtistsObjectIds = []

    for(let artist in arrArtists) {
        arrArtistsObjectIds.push(ObjectId(arrArtists[artist].value))
    }

    for(let formerArtist in arrFormerArtists) {
        arrFormerArtistsObjectIds.push(ObjectId(arrFormerArtists[formerArtist].value))
    }

    let update = {
        ...req.body,
        artists: arrArtistsObjectIds,
        formerArtists: arrFormerArtistsObjectIds,
        artistsV: arrArtists,
        formerArtistsV: arrFormerArtists
    };

    if(req.file !== undefined) {
        update.groupImage = ObjectId(req.file.id)
        update.groupImageLink = `http://localhost:8000/images/${req.file.id}`
    }

    Group
    .findOneAndUpdate({_id: req.params.id}, update)
    .then((oldGroup) =>  {        
        if(req.file === undefined) {
            res.status(200).json({success: true})
        } 
        
        // delete old img
        if(req.file !== undefined) {
            gfs.grid.remove({_id : oldGroup.groupImage, root: 'image'}, (err, gridStore) => {
                res.status(200).json({success: true})
            })
        }
        
    })
    .catch((err) => {
        res.status(422).json({success: false, err: 'Something went wrong. Try it later again.'})
    })
});

router.delete('/:id', (req, res) => {
    Group
    .findOne({_id: req.params.id})
    .then((group) => {
        if(group === null) {
            res.status(404).json({success: false})
        }

        // delete pic 
        const deleteImage = new Promise((resolve, reject) => {
            gfs.grid.remove({_id : group.groupImage, root: 'image'}, (err, gridStore) => {
                resolve()
            })
        })

        const deleteGroup = new Promise((resolve, reject) => {
            Group
            .findOneAndDelete({_id: req.params.id})
            .then(() => { 
                resolve()
            })
            .catch((err) => {
                reject()
            })
        })

        Promise
        .all([deleteImage, deleteGroup])
        .then((values) => {   
            res.status(200).json({success: true})
        }) 
        .catch((err) => {
            res.status(422).json({success: false})
        })
    })
})
 
module.exports = router;
