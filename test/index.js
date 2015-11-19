'use strict';

var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;
var before = lab.before;

/**
 * A callback function with error and server parameters
 *
 * @callback serverCallback
 * @param {Error} error
 * @param {Hapi.Server} server
 */

/**
 * Create a server with alive plugin
 * @param {object} options Alive plugin options
 * @param {serverCallback} callback Callback function
 */
var createServer = function (options, callback) {

    var server = new Hapi.Server({
        debug: false
    });
    server.connection();

    server.register({
        register: require('../'),
        options: options
    }, function (err) {

        callback(err, server);
    });
};

describe('Alive plugin with default options', function () {

    var server;

    before(function (done) {

        createServer(null, function (err, _server) {

            server = _server;
            done(err);
        });
    });

    it('should be healthy', function (done) {

        server.inject({
            method: 'GET',
            url: '/health'
        }, function (res) {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });

});

describe('Alive plugin with custom options', function () {

    var server, shouldFail;

    before(function (done) {

        createServer({
            path: '/monitor/health',
            healthCheck: function (_server, callback) {

                if (shouldFail) {
                    return callback(new Error('Something went wrong!'));
                }
                callback();
            }
        }, function (err, _server) {

            server = _server;
            done(err);
        });
    });

    it('should be healthy', function (done) {

        shouldFail = false;
        server.inject({
            method: 'GET',
            url: '/monitor/health'
        }, function (res) {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should not be healthy', function (done) {

        shouldFail = true;
        server.inject({
            method: 'GET',
            url: '/monitor/health'
        }, function (res) {

            expect(res.statusCode).to.equal(400);
            done();
        });
    });

});
