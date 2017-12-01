# hapi-alive
[![Build Status](https://travis-ci.org/idoshamun/hapi-alive.svg)](https://travis-ci.org/idoshamun/hapi-alive)
[![Code Climate](https://codeclimate.com/github/idoshamun/hapi-alive/badges/gpa.svg)](https://codeclimate.com/github/idoshamun/hapi-alive)
[![Test Coverage](https://codeclimate.com/github/idoshamun/hapi-alive/badges/coverage.svg)](https://codeclimate.com/github/idoshamun/hapi-alive/coverage)

> Health route for your hapi.js server

## Requirements

- Node 8+
- Hapi 17+

## Usage

### Install from NPM

```sh
npm install --save hapi-alive
```

### Options

The defaults are as described below. You can override any defaults by passing them in as options.

```javascript
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
    healthCheck: async function (_server) {

        return await true;
    },
    auth: false
};
```

### Example

```javascript
var Hapi = require('hapi');

async function createServer() {
    const server = Hapi.Server();

    // Register alive plugin
    await server.register({
        plugin: require('hapi-alive'),
        options: {
            path: '/health', //Health route path
            tags: ['health', 'monitor'],
            healthCheck: async function(server) {
                //Here you should preform your health checks
                //If something went wrong , throw an error.
                if (somethingFailed) {
                    throw new Error('Server not healthy');
                }
                return await true;
            }
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
}
```

### Calling the health route

The health route is exposed using `GET` method in a given path (`/health` by default).

When the server is healthy the response status code should be 200.

When the health check returns error the status code should be 400 and the payload should contain the error title.

### Change Log
- v2.0.0 (Nov. 30th, 2017) Upgrade to Hapi 17
  - Hapi.js 17 suite of tool upgraded to latest.
  - healthCheck API converted to async/await pattern. Callback is no longer accepted.
- v1.2.0
- v1.1.0
- v1.0.0
