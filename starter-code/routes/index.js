const express = require('express');
const router  = express.Router();
const User = require('../models/users');

const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;



/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  let {username, password} = req.body
  
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  let user = new User({username, password: hashPass})
  user.save()
  .then(usr => {
    res.redirect('/');
  })
  .catch(err => {
    next(err)
  })
});


router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


let isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get('/secret', isAuthenticated, (req, res, next) => {
  res.render('secret');
});

router.get('/pompom', (req, res, next) => {
  res.render('index');
});

module.exports = router;
