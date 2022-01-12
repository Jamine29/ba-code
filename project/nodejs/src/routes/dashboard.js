const express = require('express');
const app = express();
const router = express.Router();
const Group = require('../models/Group'); 
const User = require('../models/User'); 
const Artist = require('../models/Artist'); 
const ObjectId = require('mongodb').ObjectID;
const { find } = require('../models/Group');
const bcrypt = require('bcryptjs');
const {upload, gfs, gridfsBucket} = require('../store/index');

router.get('/', (req, res) => {
    let {page, limit} = req.query

    let artistList = []
    let groupList = []

    const artists = new Promise((resolve, reject) => {
        Artist
        .paginate({author: req.user._id}, {page, limit})
        .then((result) => { 
            artistList = result;
            resolve()
        })
        .catch((err) => {
            reject()
        })
    })

    const groups = new Promise((resolve, reject) => {
        Group
        .paginate({author: req.user._id}, {page, limit})
        .then((result) => { 
            groupList = result;
            resolve()
        })
        .catch((err) => {
            reject()
        })
    })

    Promise
    .all([artists, groups])
    .then((values) => {   
        res.status(200).json({artists: artistList, groups: groupList})
    }) 
    .catch((err) => {
        res.status(422).json({success: false})
    })
})

router.get('/artists', (req, res) => {
    const {page, limit} = req.query;

    Artist
    .paginate({author: req.user._id}, {page, limit})
    .then((result) => { 
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(422).json({success: false})
    })
})

router.get('/groups', (req, res) => {
    const {page, limit} = req.query;

    Group
    .paginate({author: req.user._id}, {page, limit})
    .then((result) => { 
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(422).json({success: false})
    })
})

router.get('/user', (req, res) => {
    res.status(200).json({email: req.user.email})
})

router.post('/user/email', (req, res) => {
    User
    .findOne({email: req.body.email})
    .then(result => {
        if(result !== null) {
            res.status(422).json({success: false, err: 'Email is already taken.'}) 
        }
        else {
            User
            .findOneAndUpdate({_id: req.user._id}, {email:  req.body.email})
            .then(result => {
                res.status(200).json({success: true, message: 'Update was successful.'})
            })
            .catch((err) => {
                res.status(422).json({success: false, err: 'Sorry. Something went wrong. Try it later again or reload the page.'})
            })
        }
    })
})

router.post('/user/password', (req, res) => {
    if(bcrypt.compareSync(req.body.currentPassword, req.user.password)) {
        let hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
        let filter = {_id: req.user._id};
        let update = {password: hashedPassword};

        User
        .findOneAndUpdate(filter, update, {new: true, safe: true})
        .then((user) => {
            res.status(200).json({success: true, message: 'Update was successful.'})
        })
        .catch((err) => {
            res.status(422).json({success: false, err: 'Sorry. Something went wrong. Try it later again or reload the page.'})
        })
    }
    else {
        res.status(422).json({success: false, err: 'Old password is wrong.'})
    }
})

router.delete('/delete', (req, res) => {
    const deleteGroup = new Promise((resolve, reject) => {
        // delete Group
        Group
        .find({author: req.user._id})
        .then((group) => { 
            let promises = []
            for(let i = 0; i < group.length; i++) {
                // delete pic 
                promises.push(
                    new Promise((resolve, reject) => {
                        gfs.grid.remove({_id : group[i].groupImage, root: 'image'}, (err, gridStore) => {
                            resolve()
                        })
                    }),

                    new Promise((resolve, reject) => {
                        Group
                        .deleteMany({author: req.user._id})
                        .then(() => { 
                            resolve()
                        })
                        .catch((err) => {
                            reject()
                        })
                    })
                )
            }

            Promise
            .all(promises)
            .then(values => {   
                resolve()
            }) 
            .catch((err) => {
                res.status(422).json({success: false})
            })
        })
    })

    const deleteArtist = new Promise((resolve, reject) => {
        // delete Artist
        let artistPromises = [];

        Artist
        .find({author: req.user._id})
        .then((artist) => { 
            for(let i = 0; i < artist.length; i++) {
                // delete Artist in list artists and formerArtists of group
                artistPromises.push(
                    new Promise((resolve, reject) => {
                        let filter = { $or: [ {artists: ObjectId(artist[i]._id)}, {formerArtists: ObjectId(artist[i]._id)}]}
                        let update = {$pull: {artists: ObjectId(artist[i]._id), formerArtists: ObjectId(artist[i]._id)}}

                        Group
                        .updateMany(filter, update)
                        .then((result) => {
                            resolve()                                                     
                        })
                        .catch((err) => {
                            reject()
                        })
                    }),
                    new Promise((resolve, reject) => {
                        gfs.grid.remove({_id : artist[i].profileImage, root: 'image'}, (err, gridStore) => {
                            if (err) {
                                reject()
                            }
                            // res.redirect("/")
                            resolve()
                        })
                    }),
                    new Promise((resolve, reject) => {
                        // delete Artist 
                        Artist
                        .findOneAndDelete({_id: artist[i]._id})
                        .then(() => { 
                            resolve()
                        })
                        .catch((err) => {
                            res.status(422).json({success: false})
                        })
                    })
                )
            }

            Promise
            .all(artistPromises)
            .then((values) => {   
                resolve()
            }) 
            .catch((err) => {
                reject()
            })
        })
    })

    const deleteUser = new Promise((resolve, reject) => {
        User
        .findOneAndDelete({_id: req.user._id})
        .then((result) => {
            resolve()
        })
        .catch((err) => {
            reject()
        })
    })

    Promise
    .all([deleteArtist, deleteGroup, deleteUser])
    .then((values) => {   
        res.status(200).json({success: true})
    }) 
    .catch((err) => {
        reject()
    })
})

module.exports = router