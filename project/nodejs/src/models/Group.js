const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const groupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    groupImage: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    groupImageLink: {
        type: String,
        required: false
    },
    facts: {
        type: String,
        required: false
    },
    companies: {
        type: String,
        required: false
    },
    videoLink: {
        type: String,
        required: false
    },
    videoSrc: {
        type: String,
        required: false
    },
    debutDate: {
        type: String,
        required: false
    },
    yearsActive: {
        type: String, 
        required: false
    },
    fandomName: {
        type: String,
        required: false
    }, 
    artists: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }],
    formerArtists:[{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }],
    artistsV: [{
        _id: false,
        value: String,
        label: String
    }],
    formerArtistsV:[{
        _id: false,
        value: String,
        label: String
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

groupSchema.plugin(mongoosePaginate);

module.exports = Group = mongoose.model('Group', groupSchema);