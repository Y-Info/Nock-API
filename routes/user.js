const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signUp);
router.post('/login', userCtrl.login);
router.delete('/:id',auth, userCtrl.deleteUser);
router.get('/:id',auth, userCtrl.getOneUser);
router.get('/', auth,userCtrl.getAllUsers);
router.put('/:id', auth, userCtrl.updateUser);

router.get('/posts/:id', userCtrl.getUserWithPosts);
router.get('/comments/:id', userCtrl.getUserWithComments);

module.exports = router;
