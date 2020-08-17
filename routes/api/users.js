const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/users/register');
const validateLoginInput = require('../../validation/users/login');
const validateEditInput = require('../../validation/users/edit');

const User = require('../../models/User');

router.post('/adduser', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if( !isValid ) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {

        if( user ) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if( err ) throw err;
                    newUser.password = hash;
                    newUser.save().then( user=> res.json(user) ).catch(err => console.log(err));
                });
            });
        }

    });

});

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if( !isValid ) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {

        if(!user) {
            return res.status(404).json({ emailnotfound: 'Email not found' });
        }

        bcrypt.compare(password, user.password).then(isMatch => {

            if(isMatch) {

                const payload = {
                    id: user.id,
                    name: user.name
                };

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 31556926 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                );
            } else {
                return res.status(400).json({ passwordincorrect: 'Password incorrect' });
            }

        });

    });

});

//From this point forward, token required

router.use((req, res, next) => {

    let token = req.headers['authorization'];


    if( token ) {
        jwt.verify(token, keys.secretOrKey, (err, decoded) => {
            if( err ) {
                return res.json({ message: 'Invalid token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({ message: 'No token provided', headers: req.headers });
    }

});

router.post('/all', (req, res) => {


    User.find({}, '_id name email').then(users => {

        if( !users ) {
            return res.status(404).json({ usersnotfound: 'There are no users in the database!' });
        }

        res.status(200).json(users);

    });

});

router.get('/single/:id', (req, res) => {

    let userid = req.params.id;

    User.findById(userid).then(user => {

        if( !user ) {
            return res.status(404).json({ usernotfound: 'There is no user with ID ' + userid + ' in the database!' });
        }

        res.status(200).json(user);

    });

});

router.post('/edit/:id', (req, res) => {

    let userid = req.body.id;

    const { errors, isValid } = validateEditInput(req.body);

    if( !isValid ) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {

        if( user ) {

            let pass = req.body.password;

            const userData = {
                name: req.body.name,
                email: req.body.email
            };

            if( pass ) {

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(pass, salt, (err, hash) => {
                        if(err) throw err;
                        userData.password = hash;
                        User.findByIdAndUpdate(userid, userData)
                            .then(user => { res.json(user); })
                            .catch(err => console.log(err));
                    });
                });

            } else {

                User.findByIdAndUpdate(userid, userData)
                    .then(user => { res.json(user); })
                    .catch(err => console.log(err));

            }

        }

    });

});

router.post('/delete/:id', (req, res) => {

    let userid = req.params.id;

    User.findById(userid).then(user => {

        if( !user ) {
            return res.status(404).json({ usernotfound: 'There is no user with ID ' + userid + ' in the database!' });
        }

        User.deleteOne({ _id: userid })
            .then(user => res.status(200).json('deleted'))
            .catch(err => console.log(err));

    });

});

module.exports = router; 
