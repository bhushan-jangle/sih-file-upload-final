const express = require('express');
const router = express.Router();
const userService = require('./user.service');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var Detail = require('./user.model.js');
// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json(req.body))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback) 
  { callback(null, './uploads');},
  filename: function (req, file, callback) 
  { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});


router.post('/upload', upload.any(), function(req,res){
  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files); //form files
  
  if(!req.body && !req.files){
    res.json({success: false});
  } else {    
    var c;
    Detail.findOne({},function(err,data){
      console.log("into detail");

      if (data) {
        console.log("if");
        c = data.unique_id + 1;
      }else{
        c=1;
      }

      var detail = new Detail({

        unique_id:c,
        Name: req.body.Name,
        image1:req.files[0].filename,
        
      });

      detail.save(function(err, Person){
        if(err)
          console.log(err);
        else
          res.send(data);

      });

    }).sort({_id: -1}).limit(1);

  }
});

router.get('/:Name', function(req, res) {
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      console.log(req.params.Name);
      js = req.params.Name !== undefined ? data.filter(function(obj) {return obj.Name== req.params.Name}): data;
      res.send(js);
    }
  })
});


router.get('/', function(req, res){
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      res.send(data);
    }
  })
  
});

  