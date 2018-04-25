const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({storage: storage})

const Product = require('../../models/product');

router.get('/', (req, res, next) => {
    Product.all()
    .then( result => {
      const response = {
        count: result.length,
        products: result
      };

     // if(results.length >= 0){
        res.status(200)
          .json(response);
      /* } else {
        res.status(404)
          .json({
            message: 'No entries found'
          });
      } */
    })
    .catch((error, res) => {
      res.status(500)
        .json({
          error: error
        })
    })
  
});

router.post('/', upload.single('image'), (req, res, next) => {
  console.log(req.file);
   
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    image: 'uploads/'+req.file.filename
  });

  Product.addProduct(product)
    .then(result => {
      console.log(result)
      res.status(200)
      .json({
        message: 'Created Product Successfully',
        product: {
          name: result.name,
          price: result.price,
          _id: result._id,
          image: result.image
        }
      });
    })
    .catch((error) => {
      res.status(500)
        .json({
          error: error
        })
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.getProduct(id)
    .then(result =>  {
      console.log(result);
      if(result){
        res.status(200).json({
          product: {
            name: result.name,
            price: result.price,
            _id: result._id
          }
        });
      } else {
        res.status(404).json({
          message: 'No valid entry found'
        });
      }
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const data = {};
  for(let ops of req.body){
    data[ops.propName] = ops.value;
  }

  Product.updateProduct(id, data)
    .then(result => {
      console.log(result);
      res.status(200)
        .json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500)
        .json({
          error: err
        });
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id: id})
    .exec()
    .then( result => {
      res.status(200)
        .json({
          message: 'Product Deleted'
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

let errorHandler = (error, res) => {
  res.status(500)
    .json({
      error: error
    })
}

module.exports = router;
