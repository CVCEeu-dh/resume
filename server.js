/*

  Welcome to RESUME
  ===

*/
var settings      = require('./settings'),
    express       = require('express'),        // call express
    compress      = require('compression'),
    
    // session and cache management
    redis         = require('redis'),
    rediscli      = redis.createClient(6379, 'localhost'),
    session       = require('express-session'),
    redisStore    = require('connect-redis')(session),
    _session      = session({
                      name: 'resume.sid',
                      secret: settings.secrets.cookie,
                      // trustProxy: false,
                      resave: true,
                      saveUninitialized: true,
                      store: new redisStore({
                        client: rediscli
                      })
                    }),
    _             = require('lodash'),
    

    app           = exports.app = express(),                 // define our app using express
    port          = settings.port || process.env.PORT || 8000,
    env           = settings.env || process.env.NODE_ENV || 'development',
    
    // redis         = require('redis'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    morgan        = require('morgan')


    server        = app.listen(port),	 // start server
    io            = require('socket.io') // socket server
                      .listen(server),
    // rediscli      = redis.createClient(6379, 'localhost'), // redis client
    



    auth          = require('./auth'),


    clientRouter  = express.Router(), // basi client router
    adminRouter   = express.Router(),
    apiRouter     = express.Router(),

    clientFiles   = require('./client/src/files')[env],

    middlewares   = require('./middlewares'),

    ctrl          = require('require-all')({
                      dirname: __dirname + '/controllers',
                      filter  :  /(.*).js$/,
                      resolve : function (f) {
                        return f(io);
                      }
                    });


console.log(env)
console.log(_.keys(ctrl.client))
/*
    statics (dev mode only)
*/
if ('development' == env) {
  console.log('dev mode');
  app.use(express.static('./client/src'));
};

/*
  setup template engine
*/
app.set('views', './client/views');
app.set('view engine', 'jade');




/*
    Middlewares
*/
app.use(compress());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined'))
app.use(_session);
app.use(middlewares.session.check);
app.use(auth.passport.initialize());
app.use(auth.passport.session());


app.use('/admin', adminRouter); // register client router
app.use('/api', apiRouter); // register client router
app.use('/', clientRouter); // register client router






/*
  
  Staff router config
  ----

*/
adminRouter.use(middlewares.access.staffonly)
adminRouter.route('/').
  get(function(req, res) { // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    res.render('admin', {
      user: req.user || 'anonymous',
      scripts: clientFiles.scripts
    });
  });


/*
  
  Api router
  ---

*/
apiRouter.use(middlewares.access.loginrequired)
apiRouter.route('/story').
  get(ctrl.story.findAll)

/*
  
  Client router configuration
  ----
  Routes that do not need authentification go here.
  This is the las one because it handles the 404 page
*/
clientRouter.route('/').
  get(function(req, res) { // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    res.render('index', {
      user: req.user || 'anonymous',
      scripts: clientFiles.scripts
    });
  });
clientRouter.route('/logout')
  .get(ctrl.client.auth.logout);
clientRouter.route('/auth/twitter')
  .get(ctrl.client.auth.twitter);
clientRouter.route('/auth/twitter/callback')
  .get(ctrl.client.auth.twitterCallback);
clientRouter.route('/*')
  .get(function(req, res) { 
    res.render('index', {
      user: req.user || 'anonymous',
      scripts: clientFiles.scripts
    });
  });
/*
  
  Socket io config
  ------
  
  listen to connections with socket.io.
  Cfr. controllers/*.js to find how io has been implemented.
  
*/
io.use(function (socket, next) {
  _session(socket.request, {}, next);
});


/*
  REST API
  ---

  rest api response wrappers
*/
express.response.ok = function(result, info) {
  this.status(200).json({
    result: result,
    info: info || {}
  });
};

express.response.empty = function(warnings) {
  // Since The 204 response MUST NOT include a message-body, we use a dummy 200 with status = empty...
  this.status(404).json({
    status: 'empty'
  });
};

express.response.error = function(statusCode, err) {
  this.status(statusCode).json({
    error: _.assign({
      code: statusCode
    }, err)
  });
};
