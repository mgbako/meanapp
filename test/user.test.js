process.env.NODE_ENV = 'test';
const User = require('../src/models/user');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server').server;
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('User', () => {
  beforeEach(done => {
    User.remove({}, (err) => {
      done();
    })
  });
});

describe('/GET users', () => {
  it('it should GET all the users', done => {
    chai.request(app)
      .get('/users')
      .end((err, res) => {
        console.log(res.body.users)
        expect(res).to.have.status(200)
        expect(res.body.users).to.be.an('array')
        done()
      })
      
  })
});

describe('/POST user', () => {
  it('should POST a user', done => {
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
})

/* describe('Creating User', () => {
  it('saves a user', (done) => {
    const joe = new User({name: 'Joe'});

    joe.save().then(() => {
      // Has joe been save successfully?
      assert(!joe.isNew);
      done();
    })
  });
}); */