const pg = require("pg");
const bcrypt = require('bcrypt');

const db = function (dbConnectionString) {

    async function runQuery(query, params) {
        const client = new pg.Client({
            connectionString: dbConnectionString,
            ssl: true
        });

        client.connect();

        return client.query(query, params)
            .then(res => {
                return res.rows[0];
            })
            .then((data) => {
                client.end();
                return data;
            });
    }

    const getUserByUsername = async function (username) {
        return await runQuery("SELECT * FROM users WHERE username = $1", [username]);
    };

    const getUserByID = async function (userID) {
        return await runQuery('SELECT * FROM users WHERE id = $1', [userID]);
    };

    const getUserByNameAndPassword = async function (username, password) {
        let payload = null;
        return await runQuery('SELECT * FROM users WHERE username = $1', [username])
            .then(user => {
                payload = user;
                return bcrypt.compare(password, user.password);
            }).then(resp => {
                payload.valid = resp;
                return payload;
            });
    };

    const makeUserAccount = async function (username, email, pswhash) {
        return await runQuery('INSERT INTO users (id, username, email, password) VALUES(DEFAULT, $1, $2, $3) RETURNING *', [username, email, pswhash]);
    };

    return {
        getUserByID: getUserByID,
        getUserByNameAndPassword: getUserByNameAndPassword,
        getUserByUsername: getUserByUsername,
        makeUserAccount: makeUserAccount
    }
};

module.exports = db;