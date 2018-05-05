process.env.NODE_ENV = 'test';
const User = require('../src/models/user');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server').server;
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Model Test', () => {
  let joe;

  beforeEach(done => {
    let data = {
      _id: new mongoose.Types.ObjectId,
      name: "Joe",
      email: "joe@gmail.com",
      username: 'joe',
      password: '123456'
    }
    joe = new User(data)
    joe.save()
      .then(res => {
        done();
      })
  });

  it('Should Get all the users in the DB', done => {
    User.find({name: 'Joe'})
      .then(users => {
        expect(users[0]._id.toString()).to.equal(joe._id.toString());
        done();
      })
      .catch(error => console.log(error));
  });

  it('Should Get a single user in the DB by id', done => {
    User.findOne({_id: joe._id})
      .then(user => {
        expect(user.name).to.equal('Joe')
        done();
      })
      .catch(error => console.log(error));
  });

  it('Should Remove user with the model instance', done => {
    joe.remove()
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        expect(user).to.equal(null)
        done();
      })
      .catch(error => console.log(error));
  });

  it('Should Remove user with the Class method', done => {
    User.remove({name: 'Joe'})
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        expect(user).to.be.null;
        done();
      })
      .catch(error => console.log(error))
  });

  it('Should Remove user with the class findOneAndRemove method', done => {
    User.findOneAndRemove({name: 'Joe'})
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        expect(user).to.be.null;
        done();
      })
      .catch(error => console.log(error))
  });

  it('Should Remove user with the Class findByIdAndRemove', done => {
    User.findByIdAndRemove(joe._id)
      .then(() => User.findOne({name: 'Joe'}))
      .then(user => {
        expect(user).to.be.null;
        done();
      })
      .catch(error => console.log(error))
  });

  it('Should Update user with the instance type using set method', done => {
    joe.set('name', 'Alex');
    joe.save()
      .then(() => User.find({}))
      .then(users => {
        expect(users).to.have.lengthOf(1);
        expect(users[0].name).to.equal('Alex')
        done();
      })
      .catch(error => console.log(error));
  });

  it('Should Update user with the instance type using update method', done => {
    joe.update({name: 'Alex'})
      .then(() => User.find({}))
      .then(users => {
        expect(users).to.have.lengthOf(1);
        expect(users[0].name).to.equal('Alex')
        done();
      })
      .catch(error => console.log(error));
  });

});

describe('User API Tests', () => {
  beforeEach(done => {
    User.remove({}, (err) => {
      done();
    })
  });

  it('Should GET all the users', done => {
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body.users).to.be.an('array')
        done()
      })
      
  });

  it('Should Save a user', done => {
    let user = {
      name: 'mike',
      username: 'mike',
      email: 'mike@gmail.com',
      password: '123456'
    };

    chai.request(app)
      .post('/users/signup')
      .type('json')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').eql('User Created!');
        expect(res.body).to.have.property('result');
        done(); 
      });
      
  })

});