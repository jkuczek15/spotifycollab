'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var request = require('request'); 
var querystring = require('querystring');
var environment = require('../../../environments/environment');

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  get_user: get
};

/*
  GET - /user?code=<code> - Return information about the user given a authorization code
  @param: Spotify authorization code
  @return: User Information
 */
function get(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    var code = req.swagger.params.code.value;

    var redirect_uri = "http://" + environment.host + ":" + environment.api_port + "/user";
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(environment.client_id + ':' + environment.client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, access) {

        if (!error && response.statusCode === 200) {
            // make a request to spotify to get user information
            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access.access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            // Get the user's information and return it to the browser
            request.get(options, function(error, response, user) {
                // add the access properties to the user data we receive
                user['access_token'] = access.access_token;
                user['refresh_token'] = access.refresh_token;
                user['expires_in'] = access.expires_in;
                user['login_time'] = new Date().getTime() / 1000;
            
                // redirect to the dashboard with the user data in the URL
                res.redirect('http://' + environment.host + ':' + environment.ws_port + '/form#' + querystring.stringify(user));
            });
        } else {
            res.redirect('/#' + querystring.stringify({
                error: 'invalid_token'
            }));
        }// end if we have a successful response
    });
}// end function get