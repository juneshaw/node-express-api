//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
console.log('here is the app!', app);
let should = chai.should();

const isEmpty = obj =>  {
    return !obj || obj['movie']['imdbId'] === null;
}

chai.use(chaiHttp);

describe('Movies', () => {
  /*
  * Test the /GET/:id route
  */
  describe('/GET movies by id', () => {
      it('it should GET a book by id when exists', (done) => {
        chai.request(app)
            .get('/movies/2')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  isEmpty(res.body).should.be.false;
              done();
            });
      });
  });

  describe('/GET movies by id', () => {
      it('it should not GET a book by id when does not exist', (done) => {
        chai.request(app)
            .get('/movies/1')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  isEmpty(res.body).should.be.true;
              done();
            });
      });
  });
});