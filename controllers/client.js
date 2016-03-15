/*
  controller for client routes
*/
var auth          = require('../auth');


module.exports = function(io) {
  return {
    auth:{
      logout: function(req, res){
        req.logout();
        res.redirect('/')
      },
      
      twitter: function (req, res, next) {
        console.log('passed here')
        if(req.query.next) {
          var qs = '';
          
          if(req.query.jsonparams) {
            try{
              var params = JSON.parse(req.query.jsonparams),
                  qsp =  [];
                  
              for(var key in params) {
                qsp.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
              }
              
              if(qsp.length)
                qs = '?' + qsp.join('&')
            } catch(e){}
          };
          req.session.redirectAfterLogin = req.query.next + qs;
          console.log(req.query, req.params, req.session)
        }
        auth.passport.authenticate('twitter')(req, res, next)
      },
      twitterCallback:function (req, res, next) {
        auth.passport.authenticate('twitter', function(err, user, info) {
          console.log('user', user); // handle errors
          req.logIn(user, function(err) {
            if (err)
              return next(err);
            if(req.session.redirectAfterLogin) {
              console.log('redirect to', req.session.redirectAfterLogin)
              return res.redirect('/#' + req.session.redirectAfterLogin)
            }
            return res.redirect('/');
          });
        })(req, res, next)
      }
    }
  }
};