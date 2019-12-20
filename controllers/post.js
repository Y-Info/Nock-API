const Post = require('../models/Post');
const User = require('../models/User');
const Building = require('../models/Building');

exports.createPost = (req, res, next) => {
    const post = new Post({
        ...req.body
    });
    post.save()
        .then(() =>
            User.updateOne({ _id: post.author._id },
                { $push: { posts: post }})
                .then(() => next())
                .catch(error => res.status(400).json({ error })),
            Building.updateOne({ _id: post.buildingId._id },
                { $push: { posts: post }})
                .then(() => next())
                .catch(error => res.status(400).json({ error })),
            res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deletePost =  (req, res, next) => {
    Post.deleteOne({_id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprime !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.updatePost = (req,res,next) => {
    Post.updateOne({_id: req.params.id },
        { ...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifie !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next)=>{
    Post.findOne({_id: req.params.id})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({error}));
};

exports.getAllPosts =  (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllPostsByType =  (req, res, next) => {
    Post.find({type: req.params.type})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

exports.getPostsWithComment = (req,res,next) => {
    Post.findOne({_id: req.params.id})
        .populate('comments').exec()
        .then((comments) => res.status(200).json({written: comments}))
        .catch(error => res.status(500).json({ error }));
};
