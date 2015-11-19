'use strict';

var Hoek = require('hoek');
var Joi = require('joi');
var boom = require('boom');

module.exports.register = function (server, options, cb) {

    var defaults = {
        path: '/health',
        tags: ['health', 'monitor'],
        healthCheck: function (_server, callback) {

            callback();
        }
    };

    options = Hoek.applyToDefaults(defaults, options);

    server.route({
        method: 'GET',
        path: options.path,
        config: {
            tags: options.tags,
            description: 'Check if the server is healthy',
            handler: function (request, reply) {

                options.healthCheck(server, function (err) {

                    if (!err) {
                        return reply('I\'m healthy!!!');
                    }

                    return reply(boom.wrap(err, 400));
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
            }
        }
    });

    return cb();
};

module.exports.register.attributes = {
    pkg: require('../package.json')
};
