const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs')


const PostSchema = new Schema({


    user: {

        type: Schema.Types.ObjectId,
        ref: 'users'

    },


    category: {

        type: Schema.Types.ObjectId,
        ref: 'categories'

    },



    title: {

        type: String,
        required: true

    },

    status: {

        type: String,
        default: 'public'

    },
    slug: {

        type: String

    },

    comments: [{

        type: Schema.Types.ObjectId,
        ref: 'comments'


    }],
    allowComments: {

        type: Boolean,
        require: true

    },


    body: {

        type: String,
        require: true

    },

    file: {

        type: String,
    },

    date: {
        type: Date,
        default: Date.now(),


    },


});

PostSchema.plugin(URLSlugs('title', { field: 'slug' }))
module.exports = mongoose.model('posts', PostSchema);