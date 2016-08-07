var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('contacts.sqlite3');

var Contact = {
  createTable: function() {
     db.run("CREATE TABLE if not exists contacts (name TEXT, number TEXT)");
  },

  getAllContacts: function(callback) {
    var self = this;

    db.serialize(function() {
      self.createTable();

      db.all("SELECT rowid AS id, name, number FROM contacts", function(err, rows) {
        if(err) return callback(err);

        var contacts = [];
        rows.forEach(function(row) {
          contacts.push({ name: row.name, number: row.number });
        });
        return callback(null, contacts);
      });
    }); 
  },

  createContact: function(name, number, callback) {
    var self = this;

    db.serialize(function() {
      self.createTable();

      db.run("INSERT INTO contacts(name, number) VALUES (?,?)", name, number, function(err) {
        if(err) return callback(err);

        return callback(null, { name: name, number: number });
      });
    });
  },

  deleteContact: function(number, callback) {
    var self = this;

    db.serialize(function() {
      self.createTable();

      db.run("DELETE FROM contacts WHERE number=(?)", number, function(err) {
        if(err) return callback(err);

        return callback(null, number);
      });
    });
  }
};

module.exports = Contact;