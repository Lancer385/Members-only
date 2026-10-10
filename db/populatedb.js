const { Client } = require("pg");

require("dotenv").config();
const drop = ``;
const tables = `
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT NOT NULL UNIQUE,
  password varchar(60),
  membership TEXT,
  account_created_date DATE DEFAULT CURRENT_DATE
);


CREATE TABLE posts (
    author_id INT,
    post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(150) NOT NULL,
    post TEXT NOT NULL,
    FOREIGN KEY (author_id)  REFERENCES users (user_id),
    published_date TIMESTAMP DEFAULT CURRENT_DATE
);`
;
const seed = ``;

async function SQLquery(query, message) {
  console.log(message);
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(query);
  await client.end();
  console.log("done");
}

const command = process.argv[2];

if (command === "--create" || command === "-c") {
  SQLquery(tables, "creating tables...");
} else if (command === "--drop" || command === "-d") {
  SQLquery(drop, "dropping tables...");
} else if (command === "--seed" || command === "-s") {
  SQLquery(seed, "seeding...");
} else {
  console.log(
    "Usage: node ./db/populatedb.js [OPTION]\n-c, --create\nCreate your tables(only once or after reset)\n\n-d, --drop\ndrop all of the tables and start over(run --create)\n\n-s, --seed\nSeed your tables with random data",
  );
}
