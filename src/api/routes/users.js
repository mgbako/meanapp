const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err){
      res.status(500)
        .json({
          error: err
        })
    }
    
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hash
    });
    newUser.save()
    .then(result => {
      res.status(200)
        .json({
          message: 'User Created!',
          result:result,
          user: {
            _id: result._id,
            name: result.name,
            username: result.username,
            email: result.email
          }
        })
    })
    .catch(error => {
      res.status(500)
        .json({
          error: error
        })
    });
  });

  

  /* User.addUser(newUser)
    .then(result => {
      console.log(result)
      res.status(200)
        .json({
          message: 'User Created',
          result:result,
          user: {
            _id: result._id,
            name: result.name,
            username: result.username,
            email: result.email
          }
        })
    })
    .catch(error => {
      res.status(500)
        .json({
          error: error
        })
    }); */
});

router.post('/signin', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username)
    .then(user => {
      if(!user){
        res.json({message: 'User not found'});
      }

      User.comparePassword(password, user.password)
        .then(isMatch => {
          console.log(isMatch);
          if(!isMatch){
            res.status(400)
              .json({message: 'Wrong Password'})
          }

          const token = jwt.sign(user.toJSON(), process.env.SECRET, {
            expiresIn: 604800
          });

          res.json({
            token: 'Bearer '+ token,
            user: {
              _id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        });
    });
});

router.get('/', (req, res, next) => {
  User.find()
    .exec()
    .then(user => {
      res.status(200)
        .json({
          users: user
        })
    })
});

router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.remove({_id: id})
    .exec()
    .then( result => {
      res.status(200)
        .json({
          message: 'User Deleted'
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;