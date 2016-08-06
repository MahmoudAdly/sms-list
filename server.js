'use strict';
const Hapi = require('hapi');
const Hoek = require('hoek');
const Path = require('path');

const server = new Hapi.Server();
server.connection({ port: 3000 });

// APIs
server.register(require('vision'), (err) => {
  Hoek.assert(!err, err);

  server.route({
    method: 'GET',
    path: '/api/contacts',
    handler: function (request, reply) {
      reply({});
    }
  });
});

// Static files
server.register(require('inert'), (err) => {
  if (err) { throw err;}

  // Static files
  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: './src/client/public'
      }
    }
  });

  // Other pages are considered ReactJS pages
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: function (request, reply) {
      reply.file('./src/client/index.html');
    }
  });
});

// start server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});