require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.Promise = global.Promise;

const productRoutes = require('./src/api/routes/products');
const orderRoutes = require('./src/api/routes/orders');
const userRoutes = require('./src/api/routes/users');
const fileRoutes = require('./src/api/routes/files');

const uri2 = 'mongodb://mgbako:'+process.env.ATLAS_DB_PASSWORD+'@m-shop-shard-00-00-k7dif.mongodb.net:27017,m-shop-shard-00-01-k7dif.mongodb.net:27017,m-shop-shard-00-02-k7dif.mongodb.net:27017/test?ssl=true&replicaSet=m-shop-shard-0&authSource=admin';
const url = encodeURI(uri2)

if(process.env.NODE_ENV !== 'test') {

  app.use(morgan('combined'));
  mongoose.connect(url);
  mongoose.connection.once('open', () => {
    console.log('Connected')
  })
  
  .on('error', error => {
    console.warn('Warning', error);
  });
}else{
  require('./test/db/helper.test');
}

//app.use(morgan('dev'));

//app.use(cors());
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

//app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/file', fileRoutes);


app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
