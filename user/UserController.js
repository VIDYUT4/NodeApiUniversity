var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('./User');
var bcrypt = require('bcryptjs');

// CREATES A NEW USER

router.post('/', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        username : req.body.username,
        empId : req.body.empId,
        email : req.body.email,
        password : hashedPassword,
        fullName : req.body.fullName,
        designation : req.body.designation,
        phoneNumber : req.body.phoneNumber,
        dob : req.body.dob,
        doj : req.body.doj,
        gender : req.body.gender,
        userType : req.body.userType,
        reportingManagerId : req.body.reportingManagerId
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
      res.status(200).send(`${user.fullName} profile created successfully.`);
    }); 
  });

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.put('/:id', /* VerifyToken, */ function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) { 
        var requestBody = req.body;
        requestBody.password = hash
        User.findByIdAndUpdate(req.params.id, requestBody, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send({user: user, message: "Data updated successfully"});
        });
    });
    
});

module.exports = router;