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

    const getPresentationById = async function (presentationID) {
        return await runQuery('SELECT * FROM presentation WHERE id = $1', [presentationID]);
    };

    const checkUserIsAuthor = async function (userID, presentationID) {
        return await runQuery('SELECT * FROM user_isAuthor_presentation WHERE userId = $1 AND presentationId = $2', [userID, presentationID]);
    };

    const updateExistingPresentation = async function (presentation, presentationID) {
        return await runQuery('UPDATE presentation SET presentation = $1 WHERE presentationId = $2', [presentation, presentationID]);
    };

    const deleteExistingPresentation = async function (presentationID) {
        return await runQuery('DELETE FROM presentation WHERE presentationId = $1', [presentationID]);
    };

    const createPresentation = async function (userID) {
        return await runQuery("INSERT INTO presentation (presentation, visibility) VALUES ('{}', '1') RETURNING id").then(presentationID => {
            return runQuery('INSERT INTO "user_isAuthor_presentation" ("userId", "presentationId") VALUES ($1, $2) RETURNING "presentationId"', [userID, presentationID.id])
        });
    };
    return {
        getUserByID: getUserByID,
        getUserByNameAndPassword: getUserByNameAndPassword,
        getUserByUsername: getUserByUsername,
        getPresentationById: getPresentationById,
        makeUserAccount: makeUserAccount,
        checkUserIsAuthor: checkUserIsAuthor,
        updateExistingPresentation: updateExistingPresentation,
        deleteExistingPresentation: deleteExistingPresentation,
        createPresentation: createPresentation
    }
};

module.exports = db;