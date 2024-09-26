var app = require('./app');
var port = process.env.PORT || 8080;

var server = app.listen(port, function() {
  console.log('Successful to connect Mongo')
  console.log('Express server listening on port ' + port);
});