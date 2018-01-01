var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Exercise = require('../models/exercises');
var Note = require('../models/notes');
var Table = require('../models/tables');
var TableItem = require('../models/table_items');
var mid = require('../middleware');
var multer = require('multer');
  bodyParser = require('body-parser');
  //path = require('path');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var destiny;
    switch (file.mimetype) {
      case 'image/png':
      destiny = './uploads/jpg/';
      break;
      case 'image/jpeg':
      destiny = './uploads/jpg/';
      break;
      case 'image/gif':
      destiny = './uploads/gif/';
      break;
      case 'video/mp4':
      destiny = './uploads/video/';
      default:
      break;
    }
    cb(null, destiny);
  },
  filename: function(req, file, cb){
    var filename = Date.now();
    switch (file.mimetype) {
      case 'image/png':
      filename = file.fieldname + '-' + filename + ".png";
      break;
      case 'image/jpeg':
      filename = file.fieldname + '-' + filename + ".jpeg";
      break;
      case 'image/gif':
      filename = file.fieldname + '-' + filename + ".gif";
      break;
      case 'video/mp4':
      filename = file.fieldname + '-' + filename + ".mp4";
      default:
      break;
    }
    cb(null, filename);
  }
})

var upload = multer({ storage: storage })

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
router.get('/usuarios/', function(req, res, next) {
  User.find()
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('usersList', { title: 'Usuarios', user: user });
        }
      });
});
// Nuevo usuario
router.get('/usuarios/crear/', function(req, res, next){
  return res.render('usersNew', { title: 'Crear Usuario'});
})
// POST /usuarios (crear usuario)
router.post('/usuarios/crear/', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.lastname &&
    req.body.username &&
    req.body.password &&
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
        dateCreated: Date.now(),
        typeOfUser: req.body.typeOfUser,
        owner: req.session.userId,
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/usuarios/');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})
// Editar usuario
router.get('/usuarios/:id/editar/', function(req, res, next) {
  User.findOne({_id: req.params.id}, function (error, user) {
        if (error) {
          return next(error);
        }else{
          Table.find({client: req.params.id}).sort({dateCreated: 'desc'}).limit().exec(function(error, table) {
            return res.render('usersEdit', { title: 'Editar Usuario', user: user, table: table });
          });
        };
      });
});
// Ver usuario
router.get('/usuario/:id/', function(req, res, next) {
  User.findOne({_id: req.params.id}, function (error, user) {
        if (error) {
          return next(error);
        }else{
          Table.find({client: req.params.id}).sort({dateCreated: 'desc'}).limit().exec(function(error, table) {
            return res.render('usersProfile', { title: 'Perfil de Usuario', user: user, table: table });
          });
        };
      });
});
// Guardar usuario Editado
router.post('/usuarios/editar/', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.lastname &&
    req.body.username &&
    req.body.typeOfUser) {

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
router.get('/usuarios/:id/eliminar/', function(req, res, next) {
  User.findOne({_id: req.params.id}, function (error, user) {
        if (error) {
          return next(error);
        }else{
          return res.render('usersDelete', { title: 'Eliminar Usuario', user: user });
        };
      });
});
// Confirmar Eliminar usuarios 
router.get('/usuarios/:id/eliminar/confirmado/', function(req, res, next) {
 User.findByIdAndRemove(req.params.id, function (error, user) {
    if (error) {
          return next(error);
        }else{
          User.find()
            .exec(function (error, user) {
          return res.render('usersList', { title: 'Usuarios', user: user });
          });
        }
      })
    });

// Notas
// GET /usuarios lista
router.get('/notas', function(req, res, next) {
  Note.find()
      .exec(function (error, note) {
        if (error) {
          return next(error);
        } else {
          return res.render('noteList', { title: 'Notas', note: note });
        }
      });
});
// Nuevo nota
router.get('/notas/crear', function(req, res, next){
  return res.render('noteNew', { title: 'Crear Nota'});
})
// POST /notas (crear nota)
router.post('/notas/crear', function(req, res, next) {
  if (req.body.title &&
    req.body.description &&
    req.body.category &&
    req.body.subcategory) {

      // create object with form input
      var noteData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        subcategory: req.body.subcategory,
        dateCreated: Date.now(),
      };

      // use schema's `create` method to insert document into Mongo
      Note.create(noteData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/notas');
        }
      });

    } else {
      var err = new Error('Por favor rellene todos los campos.');
      err.status = 400;
      return next(err);
    }
})
// Editar nota
router.get('/notas/:id/editar', function(req, res, next) {
  Note.findOne({_id: req.params.id}, function (error, note) {
        if (error) {
          return next(error);
        }else{
          return res.render('noteEdit', { title: 'Editar Nota', note: note });
        };
      });
});
// POST /notas (editar nota)
router.post('/notas/editar', function(req, res, next) {
  if (req.body.title &&
    req.body.description &&
    req.body.category &&
    req.body.subcategory) {

      // create object with form input
      var noteData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        subcategory: req.body.subcategory
      };

      // use schema's `create` method to insert document into Mongo
      Note.update(noteData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/notas');
        }
      });

    } else {
      var err = new Error('Por favor rellene todos los campos.');
      err.status = 400;
      return next(err);
    }
})
// Eliminar notas 
router.get('/notas/:id/eliminar/', function(req, res, next) {
  Note.findOne({_id: req.params.id}, function (error, note) {
        if (error) {
          return next(error);
        }else{
          return res.render('noteDelete', { title: 'Eliminar Nota', note: note });
        };
      });
});
// Confirmar Eliminar notas 
router.get('/notas/:id/eliminar/confirmado/', function(req, res, next) {
 Note.findByIdAndRemove(req.params.id, function (error, note) {
    if (error) {
          return next(error);
        }else{
          Note.find()
            .exec(function (error, note) {
          return res.render('noteList', { title: 'Notas', note: note });
          });
        }
      })
    });

// Ejercicios
// GET /ejercicios lista
router.get('/ejercicios', function(req, res, next) {
  Exercise.find()
      .exec(function (error, exercise) {
        if (error) {
          return next(error);
        } else {
          return res.render('exerciseList', { title: 'Ejercicios', exercise: exercise });
        }
      });
});
// Nuevo ejercicio
router.get('/ejercicios/crear', function(req, res, next){
  return res.render('exerciseNew', { title: 'Crear Ejercicio'});
})
// Subir archivos nuevo ejercicio
router.get('/ejercicios/crear/:id', function(req, res, next) {
  Exercise.findOne({_id: req.params.id}, function (error, exercise) {
        if (error) {
          return next(error);
        }else{
          return res.render('exerciseEdit', { title: 'Editar Ejercicio', exercise: exercise });
        };
      });
});
router.post('/ejercicios/:id/subir/gif', upload.single('gif_url'), function (req, res) {
Exercise.findOne({ _id: req.params.id }, function (err, doc){
  doc.gif = '/' + req.file.path;
  doc.save();
  if (err) {
          return next(err);
        } else {
          return res.redirect('/ejercicios/' + req.params.id + '/editar');
        }
});
console.log(req.body); //form fields
  /* example output:
  { title: 'abc' }
   */
console.log(req.file); //form files
  /* example output:
            { fieldname: 'upl',
              originalname: 'grumpy.png',
              encoding: '7bit',
              mimetype: 'image/png',
              destination: './uploads/',
              filename: '436ec561793aa4dc475a88e84776b1b9',
              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
              size: 277056 }
   */
  res.status(204).end();
});
router.post('/ejercicios/:id/subir/thumbnail', upload.single('video_thumbnail'), function (req, res) {
Exercise.findOne({ _id: req.params.id }, function (err, doc){
  doc.jpg = '/' + req.file.path;
  doc.save();
  if (err) {
          return next(err);
        } else {
          return res.redirect('/ejercicios/' + req.params.id + '/editar');
        }
});
  res.status(204).end();
});
router.post('/ejercicios/:id/subir/video', upload.single('video_url'), function (req, res) {
Exercise.findOne({ _id: req.params.id }, function (err, doc){
  doc.video = '/' + req.file.path;
  doc.originalId = req.file.originalname;
  doc.save();
  if (err) { 
          return next(err);
        } else {
          return res.redirect('/ejercicios/' + req.params.id + '/editar');
        }
});
  res.status(204).end();
});

router.post('/ejercicios/crear', multer({ dest: './public/images/uploads/'}).any(), function(req, res, next){ 

  if (req.body.title &&
    req.body.category &&
    req.body.description) {
    var defaultImage = '/uploads/default.jpg';
      // create object with form input
      var exerciseData = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        video: defaultImage,
        gif: defaultImage,
        jpg: defaultImage,
        dateCreated: Date.now(),
      };

      // use schema's `create` method to insert document into Mongo
      Exercise.create(exerciseData, function (error, exercise) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/ejercicios/crear/' + exercise._id);
        }
      });

    } else {
      var err = new Error('Por favor rellene todos los campos.');
      err.status = 400;
      return next(err);
    }

  });

// Editar ejercicio
router.get('/ejercicios/:id/editar', function(req, res, next) {
  Exercise.findOne({_id: req.params.id}, function (error, exercise) {
        if (error) {
          return next(error);
        }else{
          return res.render('exerciseEdit', { title: 'Editar Ejercicio', exercise: exercise });
        };
      });
});
// Confirmar si Eliminar ejercicio 
router.get('/ejercicios/:id/eliminar', function(req, res) {
  Exercise.findOne({_id: req.params.id}, function (error, exercise) {
        if (error) {
          return next(error);
        }else{
          return res.render('exerciseDelete', { title: 'Eliminar Ejercicio', exercise: exercise });
        };
      });
  
});
// Eliminar ejercicio
router.get('/ejercicios/:id/eliminar/confirmado', function(req, res) {
  Exercise.findByIdAndRemove(req.params.id, function (error, exercise) {
    if (error) {
          return next(error);
        }else{
          Exercise.find()
            .exec(function (error, exercise) {
          return res.render('exerciseList', { title: 'Ejercicios', exercise: exercise });
          });
        }
      })
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
  return res.render('index', { title: 'Log In'});
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

// listado de tablas
router.get('/tablas/', function(req, res, next) {
  return res.render('tableList', { title: 'Listado de Tablas' });

});
// crear tabla paso 1/2
router.get('/tabla/nueva/:id/', function(req, res, next) {
  User.findOne({_id: req.params.id}, function (error, user) {
    if (error) {
      return next(error);
    }else{
      return res.render('tableNew', {title: 'Crear Tabla', user: user});
    };
  });

});
// crear tabla paso 2/2
router.post('/tabla/nueva/', function(req, res, next) {

  var tableData = {
        owner: req.session.userId,
        client: req.body.client,
        title: req.body.table_title,
        description: req.body.table_description,
        dateCreated: Date.now(),
        dateModified: Date.now()
      };

      // use schema's `create` method to insert document into Mongo
      Table.create(tableData, function (error, table) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/tabla/' + table._id + '/');
        }
      });
});
// Editar Tabla
router.get('/tabla/:id/', function(req, res, next) {
  Table.findOne({_id: req.params.id}, function (error, table) {
        if (error) {
          return next(error);
        }else{
          Exercise.find()
            .exec(function (error, exercise) {
              Note.find()
                .exec(function (error, note) {
                    TableItem.find({id_tabla: req.params.id}).sort({dateCreated: 'desc'})
                      .exec(function (error, tableItem) {
                        return res.render('tableEdit', { title: 'Editar Tabla', table: table, exercise: exercise, note: note, tableItem: tableItem});
                      });
                });
              });
        };
      });
});
//Eliminar Tabla
router.get('/tabla/eliminar/:id/', function(req, res, next) {
  Table.findByIdAndRemove(req.params.id, function(error, table) {
    if (error) {
      return next(error);
    }else{
      return res.redirect('/usuarios/' + table.client + '/editar/');
    }
  }); 
});

// Nuevo item de tabla /tabla/" + table.id + "/new/item/
router.post('/tabla/:id/nuevo/item/', function(req, res, next){
  var position = 0;
  TableItem.find({id_tabla: req.params.id}).sort({_id: -1}).limit(1).exec(function (error, tableItem) {
    position = tableItem.position;
    console.log(position);

  if (req.body.item_type == 'Exercise') {
    var item_title;
    var item_description;
    var item_image; 
    var item_gif;
    var item_video;

    Exercise.findOne({_id: req.body.item_id}, function(error, exercise) {
      item_title = exercise.title;
      item_description = exercise.description;
      item_image = exercise.jpg;
      item_gif = exercise.gif;
      item_video = exercise.video;

      var tableItemData = {
          id_tabla: req.params.id,
          size: req.body.columns_number,
          item_id: req.body.item_id,
          color: '#ffffff',
          type: req.body.item_type,
          sessions: req.body.sessions,
          repetitions: req.body.repetitions,
          weight: req.body.weight,
          time: req.body.time + " " + req.body.time_unit,
          dateCreated: Date.now(),
          item_title: item_title,
          item_description: item_description,
          item_image: item_image,
          item_gif: item_gif,
          item_video: item_video,
          position: position
        }
      // use schema's `create` method to insert document into Mongo
      TableItem.create(tableItemData, function (error, tableItem) {
        if (error) {
          return next(error);
        } else {
           Table.find().exec(function (error, table) {
          return res.redirect('/tabla/' + req.params.id + '/');
            });
        }
      });
    });
  } else if (req.body.item_type == 'Note') {
    Note.findOne({_id: req.body.item_id}, function(error, note) {
      item_title = note.title;
      item_description = note.description;
      var tableItemData = {
          id_tabla: req.params.id,
          size: req.body.columns_number,
          item_id: req.body.item_id,
          color: '#ffffff',
          type: req.body.item_type,
          sessions: null,
          repetitions: null,
          weight: null,
          time: null,
          dateCreated: Date.now(),
          item_title: item_title,
          item_description: item_description,
          item_image: item_image,
          item_gif: null,
          item_video: null,
          position: position
      };
    // use schema's `create` method to insert document into Mongo
      TableItem.create(tableItemData, function (error, tableItem) {
        if (error) {
          return next(error);
        } else {
           Table.find().exec(function (error, table) {
          return res.redirect('/tabla/' + req.params.id + '/');
            });
        }
      }); 
  });
  } else if (req.body.item_type == 'Separator') {
        var tableItemData = {
          id_tabla: req.params.id,
          item_id: req.body.item_id,
          color: '#ffffff',
          type: req.body.item_type,
          sessions: null,
          repetitions: null,
          weight: null,
          time: null,
          dateCreated: Date.now(),
          item_title: req.body.item_title,
          item_description: null,
          item_gif: null,
          item_video: null,
          position: position
        };
      // use schema's `create` method to insert document into Mongo
      TableItem.create(tableItemData, function (error, tableItem) {
        if (error) {
          return next(error);
        } else {
           Table.find().exec(function (error, table) {
          return res.redirect('/tabla/' + req.params.id + '/');
            });
        }
      });
  };
});

});
// Editar Table Item
router.get('/tabla/item/:id/', function(req, res, next) {
  TableItem.findOne({_id: req.params.id}, function (error, tableItem) { 
        if (error) {
          return next(error);
        }else{
          return res.render('tableItemEdit', { title: 'Editar Item Tabla', tableItem: tableItem});
         };
      });
});
// Editar item de tabla /tabla/" + table.id + "/new/item/
router.post('/tabla/editar/item/:id/', function(req, res, next){
  if (req.body.type == 'Exercise') {

    var tableItemData = {
        id_tabla: req.body.id_tabla,
        size: req.body.columns_number,
        item_id: req.body.item_id,
        color: req.body.colors,
        type: req.body.type,
        sessions: req.body.sessions,
        repetitions: req.body.repetitions,
        weight: req.body.weight,
        time: req.body.time,
        dateCreated: Date.now(),
        item_title: req.body.item_title,
        item_description: req.body.item_description, 
        item_image: req.body.item_image,
        item_gif: req.body.item_gif,
        item_video: req.body.item_video
      };
    }else if (req.body.type == 'Note') {
      var tableItemData = {
        id_tabla: req.body.id_tabla,
        size: req.body.columns_number,
        item_id: req.body.item_id,
        color: req.body.colors,
        type: req.body.type,
        dateCreated: Date.now(),
        item_title: req.body.item_title,
        item_description: req.body.item_description
      };
    }else{
      var tableItemData = {
        id_tabla: req.body.id_tabla,
        item_id: req.body.item_id,
        type: req.body.type,
        dateCreated: Date.now(),
        item_title: req.body.item_title,
      };
    }
    // use schema's `create` method to insert document into Mongo
      TableItem.findByIdAndUpdate(req.params.id, tableItemData, function (error, tableItem) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/tabla/' + req.body.id_tabla + '/');
        }
      });
  });
// Eliminar item
router.get('/tabla/eliminar/item/:id/', function(req, res, next) {
  TableItem.findByIdAndRemove(req.params.id, function(error, tableItem) {
    if (error) {
      return next(error);
    }else{
      return res.redirect('/tabla/' + tableItem.id_tabla + '/');
    }
  }); 
});


// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });

});

// GET /ejercicios
router.get('/ejercicios', function(req, res, next) {
  return res.render('exerciseList', { title: 'Ejercicios' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
