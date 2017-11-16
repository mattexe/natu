var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

// GET /dashboard
router.get('/dashboard', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('dashboard', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});
// GET /usuarios lista
router.get('/usuarios', function(req, res, next) {
  User.find()
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('usuarios', { title: 'Usuarios', user: user });
        }
      });
});

// Editar usuario
router.get('/editarusuario/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function (error, user) {
        if (error) {
          return next(error);
        }else{
          return res.render('editarusuario', { title: 'Editar Usuario', user: user });
        };
      });
});
// Guardar usuario Editado
router.post('/usuarios/editar', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.lastname &&
    req.body.username &&
    req.body.password &&
    req.body.dateCreated &&
    req.body.typeOfUser &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Las contraseñas no coinciden.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        dateCreated: Date.now(),
        typeOfUser: req.body.typeOfUser
      };

      // use schema's `update` method to insert document into Mongo
      User.update(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/usuarios');
        }
      });

    } else {
      var err = new Error('Todos los campos son obligatorios.');
      err.status = 400;
      return next(err);
    }
})


// Eliminar usuarios
router.get('/usuarios/eliminar/:id', function(req, res) {
  User.remove({_id: req.params.id}, function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/usuarios');
  });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });

});


// POST /usuarios (crear usuario)
router.post('/usuarios/crear', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.lastname &&
    req.body.username &&
    req.body.password &&
    req.body.dateCreated &&
    req.body.typeOfUser &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        dateCreated: req.body.dateCreated,
        typeOfUser: req.body.typeOfUser
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/usuarios');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });

});

// GET /ejercicios
router.get('/ejercicios', function(req, res, next) {
  return res.render('ejercicios', { title: 'Ejercicios' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
