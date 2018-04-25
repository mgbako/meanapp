const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', '_id name price')
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        orders: result
      };

      console.log(response);

      res.status(200)
        .json(response);
    })
    .catch(error => {
      console.log(error)
      res.status(500)
        .json({
          error: error
        });
    });
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.product)
    .then(product => {
      if(product == null){
        return res.status(404)
          .json({
            message: 'Product Not Found'
          });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity
      });
      return order.save()
    })
    .then(result => {
      console.log(result);
      res.status(201)
        .json({
          message: 'Created Order Successfully',
          order: result
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500)
        .json({
          error: error
        })
    });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('product quantity _id')
    .populate('product', '_id name price')
    .exec()
    .then(result => {
      if(!result){
        return res.status(404)
          .json({
            message: 'No Valid entry found'
          });
      }

      res.status(200)
        .json({
          order: result
        })
    })
    .catch(error => {
      res.status(500)
        json({
          error: error
        })
    })
});

router.patch('/:orderId', (req, res, next) => {
  res.status(200)
    .json({
      message: 'Updated order!'
    });
});

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({_id: id})
  .exec()
  .then(result => {
    res.status(200)
      .json({
        message: 'Order Deleted'
      });
  })
  .catch(error => {
    res.status(500)
      .json({
        error: error
      })
  })
});

module.exports = router;
