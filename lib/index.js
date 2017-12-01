'use strict';

const Hoek = require('hoek');
const Joi = require('joi');
const Boom = require('boom');

const register = (server, options) => {

    const defaults = {
        path: '/health',
        tags: ['health', 'monitor'],
        responses: {
            healthy: {
                message: 'I\'m healthy!!!'
            },
            unhealthy: {
                statusCode: 400
            }
        },
        healthCheck: async () => await true,
        auth: false
    };

    options = Hoek.applyToDefaults(defaults, options);

    server.route({
        method: 'GET',
        path: options.path,
        config: {
            tags: options.tags,
            description: 'Check if the server is healthy',
            handler: async function (request, h) {

                try {
                    await options.healthCheck(server);
                    return options.responses.healthy.message;
                }
                catch (err) {
                    return Boom.boomify(err, { statusCode: options.responses.unhealthy.statusCode });
                }
            },
            response: {
                schema: Joi.string().required(),
                status: {
                    500: Joi.object({
                        statusCode: Joi.number().required().description('Standard http status code'),
                        error: Joi.string().required().description('Error title'),
                        message: Joi.string().description('Error description')
                    }).required().options({
                        allowUnknown: true,
                        stripUnknown: false
                    })
                }
            },
            auth: options.auth
        }
    });
};

exports.plugin = {
    pkg: require('../package.json'),
    register
};
