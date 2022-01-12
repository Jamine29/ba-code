//const { ObjectId } = require('bson');
const express = require('express');
const app = express();
const router = express.Router();
const Group = require('../models/Group'); 
const Artist = require('../models/Artist'); 
const ObjectId = require('mongodb').ObjectID;
const {upload, gfs, gridfsBucket} = require('../store/index');
const { mongoose } = require('mongoose');

router.get('/', (req, res) => {
    let {page, limit, q} = req.query;
    
    if(q === undefined) {
        q = ""
    }

    let artists = [];
    let groups = [];

    let options = {limit, page}

    const resultArtist = new Promise((resolve, reject) => {
        Artist
        .paginate(
            {
            $or: [
                {stageName: { $regex: `.*${q}.*` , $options:"i"} },
                {birthName: { $regex: `.*${q}.*` , $options:"i"} }
            ]
            }, options
        )
        .then((result) =>{
            artists = result;
            resolve()
        })
        .catch((err) => {
            res.status(422).json({success: false})
        })
    })

    const resultGroup = new Promise((resolve, reject) => {
        Group
        .paginate(
            {
            $or: [
                {name: { $regex: `.*${q}.*` , $options:"i"} },
            ]
            }, options
        )
        .then((result) =>{
            groups = result
            resolve()
        })
        .catch((err) => {
            res.status(422).json({success: false})
        })
    })

    Promise
    .all([resultArtist, resultGroup])
    .then((values) => { 
        res.status(200).json({artists, groups})
    }) 
    .catch((err) => {
        res.status(422).json({success: false})
    })
})

router.get('/artists', (req, res) => {
    let {page, limit, q} = req.query;

    if(q === undefined) {
        q = ""
    }

    let options = {limit, page}

    Artist
    .paginate(
        {
            $or: [
                {stageName: { $regex: `.*${q}.*` , $options:"i"} },
                {birthName: { $regex: `.*${q}.*` , $options:"i"} }
            ]
        }, options
    )
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(422).json({success: false})
    })
})

router.get('/groups', (req, res) => {
    let {page, limit, q} = req.query;

    if(q === undefined) {
        q = ""
    }

    let options = {limit, page}

    Group
    .paginate(
        {
            $or: [
                {name: { $regex: `.*${q}.*` , $options:"i"} },
            ]
        }, options
    )
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(422).json({success: false})
    })
})


module.exports = router;