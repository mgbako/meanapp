const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type:String, required: true },
  price: { type:Number, required: true },
  image: { type: String},
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

productSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt){
    this.createdAt = now;
  }
  if(!this.updatedAt){
    this.updatedAt = now;
  }

  next();
});

Product = module.exports = mongoose.model('Product', productSchema);

module.exports.all = function(){
  return Product.find()
    .select('name price _id createdAt updatedAt, image')
    .exec();
}

module.exports.addProduct = (product) => {
  return product.save()
}

module.exports.getProduct = (id) => {
  return Product.findById(id)
    .exec();
}

module.exports.updateProduct = (id, data) => {
  return Product.update({_id: id}, { $set: data })
    .exec();
}