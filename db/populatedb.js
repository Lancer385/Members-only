const { Client } = require("pg");

require("dotenv").config();
const drop = `DROP TABLE IF EXISTS posts;`;
const tables = `
CREATE TABLE IF NOT EXISTS  users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT NOT NULL UNIQUE,
  password varchar(60),
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  account_created_date DATE DEFAULT CURRENT_DATE
);


CREATE TABLE posts (
    post_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(150) NOT NULL,
    post TEXT NOT NULL,
    author_id INT,
    FOREIGN KEY (author_id)  REFERENCES users (user_id),
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
;
const seed = `
INSERT INTO users (first_name, last_name, username, password) Values ('first', 'last', 'lancer', 'ASIWDJWIOFH*@q');

INSERT INTO posts (title, post, author_id) VALUES ('AITA for refusing to switch seats on a flight', 'i booked my seat months in advance specifically for the extra legroom. a family wanted to sit together and asked if i would move to a middle seat two rows back. i said no. my partner thinks i should have just done it to avoid the awkwardness, but i paid extra for that seat. the family gave me dirty looks for the rest of the flight. AITA?',
(SELECT user_id FROM users WHERE username = 'lancer'));

INSERT INTO posts (title, post, author_id) VALUES ('shower thought', 'brushing your teeth extra hard before a dentist appointment is basically cramming the night before an exam',
(SELECT user_id FROM users WHERE username = 'lancer'));

INSERT INTO posts (title, post, author_id) VALUES ('3am thoughts', 'why do we park in a driveway and drive on a parkway, someone explain',
(SELECT user_id FROM users WHERE username = 'lancer'));

INSERT INTO posts (title, post, author_id) VALUES ('conspiracy corner', 'birds are not real and i will die on this hill',
(SELECT user_id FROM users WHERE username = 'lancer'));`;

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
