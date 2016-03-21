/**

  List of dependencies for css and for js
  Cfr. gulpfile.js
  ===
*/
module.exports = {
  production: {
    scripts: [
      '/js/scripts.min.js'
    ]
  },
  development: {
    scripts: [
      '/js/lib/jquery-2.2.1.min.js',
      '/js/lib/medium-editor.min.js',
      '/js/lib/medium-editor-markdown.min.js',

      // angular
      '/js/lib/angular.min.js', 
      '/js/lib/angular-route.min.js', 
      '/js/lib/angular-resource.min.js', 
      '/js/lib/angular-cookies.min.js', 
      '/js/lib/angular-sanitize.min.js', 
      '/js/lib/angular-ui-router.min.js', 
      '/js/lib/angular-medium-editor.min.js',
      '/js/lib/angular-strap.min.js',
      '/js/lib/angular-strap.tpl.min.js',

      // resume app
      '/js/app.js',
      '/js/controllers/core.js',
      '/js/controllers/draft.js',
      '/js/controllers/index.js',
      '/js/controllers/items.js',
      '/js/controllers/login.js',
      '/js/controllers/me.js',
      
      '/js/services.js',
    ]
  }
}