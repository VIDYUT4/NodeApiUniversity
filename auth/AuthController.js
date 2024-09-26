var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const httpResponseMessage = require('../helper/httpResponseMessage');
const httpResponseCode = require('../helper/httpResponseCode');
var VerifyToken = require('./VerifyToken');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    if(user.userType === "Admin") {
      res.status(200).send({ auth: true, token: token, user, admin: true});
    }else{
      res.status(200).send({ auth: true, token: token, user });
    }
    
  });

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {
  req.body.password = bcrypt.hashSync(req.body.password, 8);
  const user = new User(req.body);
  user.save().then(
    function (user) {
      res.status(200).send({ auth: true, user});
    }).catch(err => {
      if (err.code === 11000) {
        User.findOne({ email: req.body.email }, function (err, user) {
          return res.status(httpResponseCode.ALREADY_EXIST).send({
            message: `${user.fullName} ${httpResponseMessage.ALL_READY_EXIST_USER}`,
            auth: false
          });
        });
      }
    });



  
  

  // if (!req.body.email) {
  //   return res.status(httpResponseCode.BAD_REQUEST).send({
  //     message: `User ${httpResponseMessage.EMAIL_IS_REQ}`
  //   });
  // }
  // req.body.password = bcrypt.hashSync(req.body.password, 8);
  // const user = new User(req.body);
  // user.save().then(data => {
  //   res.status(httpResponseCode.EVERYTHING_IS_OK).send(data);
  // }).catch(err => {
  //   if (err.code === 11000) {
  //     return res.status(httpResponseCode.ALREADY_EXIST).send({
  //       message: `user name ${req.body.username} ${httpResponseMessage.ALREADY_EXIST}`
  //     });
  //   }
  //   res.status(httpResponseCode.INTERNAL_SERVER_ERROR).send({
  //     message: err.message || `${httpResponseMessage.CREATE_ERROR} User Name.`
  //   });
  // });

});

router.get('/class_user', VerifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

module.exports = router;