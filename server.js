'use strict';
const Hapi = require('hapi');
const Hoek = require('hoek');
const Path = require('path');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('contacts.sqlite3');

const server = new Hapi.Server();
server.connection({ port: 3000 });

// APIs
server.register(require('vision'), (err) => {
  Hoek.assert(!err, err);

  server.route({
    method: 'GET',
    path: '/api/contacts',
    handler: function (request, reply) {
      db.serialize(function() {
        db.run("CREATE TABLE if not exists contacts (name TEXT, number TEXT)");

        var contacts = [];
        db.all("SELECT rowid AS id, name, number FROM contacts", function(err, rows) {
          rows.forEach(function(row) {
            contacts.push({ name: row.name, number: row.number });
          });
          reply({ data: { contacts: contacts }});
        });
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/contacts/add',
    handler: function (request, reply) {
      var name = request.payload.name;
      var number = request.payload.number;

      db.serialize(function() {
        db.run("CREATE TABLE if not exists contacts (name TEXT, number TEXT)");

        db.run("INSERT INTO contacts(name, number) VALUES (?,?)", name, number, function(err) {
          if(err) console.log(err);

          // db.close();
          reply({ data: { contact: { name: name, number: number }}});
        });
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/api/contacts/remove',
    handler: function (request, reply) {
      var number = request.payload.number;

      db.serialize(function() {
        db.run("CREATE TABLE if not exists contacts (name TEXT, number TEXT)");

        db.run("DELETE FROM contacts WHERE number=(?)", number, function(err) {
          if(err) console.log(err);

          // db.close();
          reply({ data: { contact: { number: number }}});
        });
      });
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