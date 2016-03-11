
var app = require('../server').app,

    Session = require('supertest-session')({
      app: app
    }),
    suite     = {};

before(function(done){
  session = new Session();
  generator.before(suite, done);
});

after(function(done){
  session.destroy();
  generator.after(done);
});


describe('controller:user', function() {
  it('should get the users', function(done){
    done();
  })
});