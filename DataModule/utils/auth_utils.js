var Q = require('q');
var nconf = require('nconf');
var Client = require('node-rest-client').Client;
var client = new Client();
var nconf = nconf.file("./settings/settings.json").load();
function verify(authToken) {
    return Q.promise(function (resolve, reject) {
        if (!authToken) {
            reject('no access token');
        }
        else {
            var searchUrl = nconf.pro.loginUrl + 'auth/verify?access_token=' + authToken;
            var searchArgs = {
                headers: { "Content-Type": "application/json" },
            };
            client.get(searchUrl, searchArgs, function (data, response) {
                if (data.status === "correct") {
                    resolve('token_valid');
                }
                else {
                    reject('token_invalid');
                }
            }).on('error', function (err) {
                reject('token_invalid');
            });
        }
    });
}
module.exports = {
    verify: verify,
};
//# sourceMappingURL=auth_utils.js.map