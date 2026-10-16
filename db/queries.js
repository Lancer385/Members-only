import pool from "./pool.js";

async function getUserByID(ID){
    const user = (await pool.query("SELECT * FROM users WHERE user_id = $1", [ID])).rows[0];
    return user;
};
async function getUserByUsername(username) {
     const user = (await pool.query("SELECT * FROM users WHERE username = $1", [username])).rows[0];
     return user;
}

async function signupUser(first_name, last_name, user_name, password){
    await pool.query("INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)", [
      first_name,
      last_name,
      user_name,
      password
    ]);
}
export {getUserByID, getUserByUsername, signupUser}

