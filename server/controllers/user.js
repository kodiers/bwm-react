const User = require('../models/user');
const {normalizeErrors} = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/index');


exports.auth = function (req, res) {
  const {email, password}  = req.body;
  if (!email || !password) {
    return res.status(400).send({errors: [{title: 'Data missing!', detail: 'Provide email and password'}]});
  }
  User.findOne({email}, function (err, user) {
    if (err) {
      return res.status(500).send({errors: normalizeErrors(err.errors)});
    }
    if (!user) {
      return res.status(400).send({errors: [{title: 'Invalid user!', detail: 'User not exists'}]});
    }
    if (user.hasSamePassword(password)) {
      // return JWT
      const token = jwt.sign({
        userId: user.id,
        username: user.username
      }, config.secret, { expiresIn: '1h' });
      return res.json(token);
    } else {
      return res.status(401).send({errors: [{title: 'Wrond data!', detail: 'Invalid email or password'}]});
    }
  });
};

exports.register = function (req, res) {
  const {username, email, password, passwordConfirmation}  = req.body;
  if (!email || !password) {
    return res.status(400).send({errors: [{title: 'Data missing!', detail: 'Provide email and password'}]});
  }
  if (password !== passwordConfirmation) {
    return res.status(400).send({errors: [{title: 'Invalid password!', detail: 'Password is not a same as confirmation'}]});
  }
  User.findOne({email}, function (err, existingUser) {
    if (err) {
      return res.status(500).send({errors: normalizeErrors(err.errors)});
    }
    if (existingUser) {
      return res.status(400).send({errors: [{title: 'Invalid email!', detail: 'User with this already exists'}]});
    }
    const user = new User({
      username: username, email: email, password: password
    });
    user.save(function (err) {
      if (err) {
        return res.status(500).send({errors: normalizeErrors(err.errors)});
      }
      return res.json({'registered': true});
    });
  });
};

exports.authMiddleware = function (req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    const user = parseToken(token);
    User.findById(user.userId, function (err, user) {
      if (err) {
        return res.status(500).send({errors: normalizeErrors(err.errors)});
      }
      if (user) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    })
  } else {
    return notAuthorized(res);
  }
};

function parseToken(token) {
  return jwt.verify(token.split(' ')[1], config.secret);
}

function notAuthorized(res) {
  return res.status(403).send({errors: [{title: 'Not authorized!', detail: 'You need login'}]});
}
