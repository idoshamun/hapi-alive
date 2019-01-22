'use strict';

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const Alive = require('../');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const before = lab.before;

/**
 * Create a server with alive plugin
 * @param {object} options Alive plugin options
 * @returns {object} Hapi.js server
 */
const createServer = async function (options) {

    const server = Hapi.Server({
        debug: false
    });

    await server.register({
        plugin: Alive,
        options
    });

    return server;
};

describe('Alive plugin with default options', () => {

    let server;

    before(async () => {

        server = await createServer(null);
    });

    it('should be healthy', async () => {

        const res = await server.inject({
            method: 'GET',
            url: '/health'
        });
        expect(res.statusCode).to.equal(200);
    });

});

describe('Alive plugin with custom options', () => {

    let server;
    let shouldFail;

    before(async () => {

        server = await createServer({
            path: '/monitor/health',
            healthCheck: async (_server) => {

                if (shouldFail) {
                    throw new Error('Something went wrong!');
                }

                return await true;
            }
        });
    });

    it('should be healthy', async () => {

        shouldFail = false;

        const res = await server.inject({
            method: 'GET',
            url: '/monitor/health'
        });

        expect(res.payload).to.equal('I\'m healthy!!!');
        expect(res.statusCode).to.equal(200);
    });

    it('should not be healthy', async () => {

        shouldFail = true;

        const res = await server.inject({
            method: 'GET',
            url: '/monitor/health'
        });

        expect(res.statusCode).to.equal(400);
    });

});

describe('Alive plugin with overrides', () => {

    let server;
    let shouldFail;

    before(async () => {

        server = await createServer({
            path: '/monitor/health',
            healthCheck: async (_server) => {

                if (shouldFail) {
                    throw new Error('Something went wrong!');
                }

                return await true;
            },
            responses: {
                healthy: {
                    message: 'OK'
                },
                unhealthy: {
                    statusCode: 503
                }
            }
        });
    });

    it('should be healthy', async () => {

        shouldFail = false;

        const res = await server.inject({
            method: 'GET',
            url: '/monitor/health'
        });

        expect(res.payload).to.equal('OK');
        expect(res.statusCode).to.equal(200);
    });

    it('should not be healthy', async () => {

        shouldFail = true;

        const res = await server.inject({
            method: 'GET',
            url: '/monitor/health'
        });

        expect(res.statusCode).to.equal(503);
    });

});
