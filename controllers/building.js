const Building = require('../models/Building');
const User = require('../models/User');


const safeDelOneBuilding = require('../middleware/functions/deleteOneBuilding');

exports.createBuilding = (req, res) => {
    const building = new Building({
        ...req.body
    });
    building.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.safeDeleteBuilding =  (req, res, next) => {
    safeDelOneBuilding(req.params.id , next);
    res.status(200).json({ message: 'Objet supprime !'});
};

exports.updateBuilding = (req,res) => {
    Building.updateOne({_id: req.params.id },
        { ...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifie !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.addUserToBuilding = (req,res, next) => {

    Building.updateOne({_id: req.params.id },
        { _id: req.params.id, $push: { residents: req.body.userId }},)
        .then(() => next)
        .catch(error => res.status(400).json({ error }));

    User.updateOne({_id: req.body.userId}, { buildingId : req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifie !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBuilding = (req, res)=>{
    Building.findOne({_id: req.params.id})
        .then(building => res.status(200).json(building))
        .catch(error => res.status(404).json({error}));
};

exports.getAllBuilding =  (req, res) => {
    Building.find()
        .then(buildings => res.status(200).json(buildings))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllBuildingInfos = (req,res) => {
    Building.findOne({_id: req.params.id})
        .populate({
            path: 'posts',
            populate:  [
                {
                    path: 'comments',
                    options: {limit: 1},
                    populate: {
                        path: 'author',
                        select: ['lastName', 'firstName']
                    }
                },
                {
                    path: 'author',
                    select: ['lastName', 'firstName']
                }
            ],
        })
        .exec()
        .then((posts) => res.status(200).json({feed: posts}))
        .catch(error => res.status(500).json({ error }));
};

exports.getAllBuildingInfosFilterByPostsType = (req,res) => {
    if(req.params.type === 'alert'){
        Building.findOne({_id: req.params.id})
            .populate({
                path: 'posts',
                match: { alert: true},
                populate:  [
                    {
                        path: 'comments',
                        options: {limit: 1},
                        populate: {
                            path: 'author',
                            select: ['lastName', 'firstName']
                        }
                    },
                    {
                        path: 'author',
                        select: ['lastName', 'firstName']
                    }
                ],
            })
            .exec()
            .then((posts) => res.status(200).json({feed: posts}))
            .catch(error => res.status(500).json({ error }));
    }else{
        Building.findOne({_id: req.params.id})
            .populate({
                path: 'posts',
                match: { type: req.params.type},
                populate:  [
                    {
                        path: 'comments',
                        options: {limit: 1},
                        populate: {
                            path: 'author',
                            select: ['lastName', 'firstName']
                        }
                    },
                    {
                        path: 'author',
                        select: ['lastName', 'firstName']
                    }
                ],
            })
            .exec()
            .then((posts) => res.status(200).json({feed: posts}))
            .catch(error => res.status(500).json({ error }));
    }
};


exports.getAllBuildingWithUsers = (req,res) => {
    Building.findOne({_id: req.params.id})
        .populate('residents').exec()
        .then((users) => res.status(200).json({resident: users}))
        .catch(error => res.status(500).json({ error }));
};

exports.getBuildingByAddress =  (req, res) => {
    Building.find({address: req.body.address})
        .then(building => res.status(200).json(building))
        .catch(error => res.status(400).json({ error }));
};
