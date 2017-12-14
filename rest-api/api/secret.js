var environment = require('../../environments/environment');

module.exports = {
    CLIENT_ID: 'b6f40e9463ba406792aa0914d5c64bcb',
    CLIENT_SECRET: 'b46c432f728b4131b90eb0109604f010',
    REDIRECT_URI: 'http://' + environment.host + ':' + environment.api_port + '/user'
}