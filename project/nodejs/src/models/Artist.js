const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const artistSchema = new Schema({
    birthName: {
        type: String,
        required: false
    },
    stageName: {
        type: String,
        required: false
    },
    birthday: {
        type: String,
        required: false
    },
    zodiacSign: {
        type: String,
        required: false
    },
    nationality: {
        type: String,
        required: false
    },
    height: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    bloodType: {
        type: String,
        required: false
    },
    positions: {
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
    profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'image.files'
    }, 
    profileImageLink: {
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

artistSchema.plugin(mongoosePaginate);

module.exports = Artist = mongoose.model('Artist', artistSchema);