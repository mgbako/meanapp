const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({storage: storage}).single('file');


router.get('/', (req, res, next) => {
  const publicPath = path.join(__dirname, '../../../', '/public/uploads');
  console.log(publicPath)
  const dirBuf = Buffer.from(publicPath);
  fs.readdir(dirBuf, (err, files) => {
    if(err) {
      res.json({
        error: err
      })
    } else {
      res.json({
        files
      })
    }
  })
})
.post('/', (req, res, next) => {
   upload(req, res, (err) => {
     if(err) {
       res.json({
         error: err
       })
     } else {
       console.log('req.file', req.file);
       res.json({
         file: req.file
       });
     }

   }) 
});

module.exports = router;
