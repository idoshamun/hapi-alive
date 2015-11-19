'use strict';

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const before = lab.before;

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
const createServer = function (options, callback) {

    const server = new Hapi.Server({
        debug: false
    });
    server.connection();

    server.register({
        register: require('../'),
        options: options
    }, (err) => {

        callback(err, server);
    });
};

describe('Alive plugin with default options', () => {

    let server;

    before((done) => {

        createServer(null, (err, _server) => {

            server = _server;
            done(err);
        });
    });

    it('should be healthy', (done) => {

        server.inject({
            method: 'GET',
            url: '/health'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });

});

describe('Alive plugin with custom options', () => {

    let server;
    let shouldFail;

    before((done) => {

        createServer({
            path: '/monitor/health',
            healthCheck: (_server, callback) => {

                if (shouldFail) {
                    return callback(new Error('Something went wrong!'));
                }
                callback();
            }
        }, (err, _server) => {

            server = _server;
            done(err);
        });
    });

    it('should be healthy', (done) => {

        shouldFail = false;
        server.inject({
            method: 'GET',
            url: '/monitor/health'
        }, (res) => {

            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should not be healthy', (done) => {

        shouldFail = true;
        server.inject({
            method: 'GET',
            url: '/monitor/health'
        }, (res) => {

            expect(res.statusCode).to.equal(400);
            done();
        });
    });

});
