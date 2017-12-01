# hapi-alive
[![Build Status](https://travis-ci.org/idoshamun/hapi-alive.svg)](https://travis-ci.org/idoshamun/hapi-alive)
[![Code Climate](https://codeclimate.com/github/idoshamun/hapi-alive/badges/gpa.svg)](https://codeclimate.com/github/idoshamun/hapi-alive)
[![Test Coverage](https://codeclimate.com/github/idoshamun/hapi-alive/badges/coverage.svg)](https://codeclimate.com/github/idoshamun/hapi-alive/coverage)

> Health route for your hapi.js server

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
    healthCheck: function (_server, callback) {

        callback();
    },
    auth: false
};
```

### Example

```javascript
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });
// Register alive plugin
server.register({
    register: require('hapi-alive'),
    options: {
        path: '/health', //Health route path
        tags: ['health', 'monitor'],
        healthCheck: function(server, callback) {
            //Here you should preform your health checks
            //If something went wrong provide the callback with an error
            callback();
        }
    }
}, function (err) {

    if(err){
      console.log(err);
    }
});

server.start(function () {

  console.log('Server running at:', server.info.uri);
});
```

### Calling the health route

The health route is exposed using `GET` method in a given path (`/health` by default).

When the server is healthy the response status code should be 200.

When the health check returns error the status code should be 400 and the payload should contain the error title.
