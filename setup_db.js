const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./onsite_database.db');

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)',
    (err) => {
      if (err) {
        console.error('Error:', err.message);
      } else {
        console.log('Table created successfully.');
      }
    }
  );
});

db.close();
