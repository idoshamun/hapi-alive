'use strict';

const Hoek = require('hoek');
const Joi = require('joi');
const Boom = require('boom');

module.exports.register = function (server, options, cb) {

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
        healthCheck: function (_server, callback) {

            callback();
        },
        auth: false
    };

    options = Hoek.applyToDefaults(defaults, options);

    server.route({
        method: 'GET',
        path: options.path,
        config: {
            tags: options.tags,
            description: 'Check if the server is healthy',
            handler: function (request, reply) {

                options.healthCheck(server, (err) => {

                    if (!err) {
                        return reply(options.responses.healthy.message);
                    }

                    return reply(Boom.wrap(err, options.responses.unhealthy.statusCode));
                });
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

    return cb();
};

module.exports.register.attributes = {
    pkg: require('../package.json')
};
