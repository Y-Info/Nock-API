const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: {type: String, required: true},
    // Table linking
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

commentSchema.index({ content: 'text' });

module.exports = mongoose.model('Comment', commentSchema);
