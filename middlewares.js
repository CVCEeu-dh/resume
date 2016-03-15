/*
  Some middlewares for router.use
*/
var settings = require('./settings');

module.exports = {
  session: {
    check:  function (req, res, next) {
      if (!req.session) {
        res.status(500).send('unable to setup a session'); // handle error
      }
      next() // otherwise continue
    }
  },
  access: {
    /*
      use:
    */
    staffonly: function (req, res, next) {
      if(req.isAuthenticated() && req.user.isStaff) {
        return next();
      } else {
        return res.error(403);
      }
    },

    /*
      
    */
    loginrequired: function (req, res, next) {
      if(req.isAuthenticated()) {
        return next();
      } else{
        return res.error(403);
      }
    }
  }
  
}