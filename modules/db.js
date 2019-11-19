const pg = require("pg");

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

    const getUserByUsername = async function (username){
        return await runQuery("SELECT * FROM users WHERE username = $1", [username]);
    }

    const getUserByID = async function (userID) {
        return await runQuery('SELECT * FROM users WHERE id = $1', [userID]);
    };

    const makeUserAccount = async function (username, email, pswhash){
        return await runQuery('INSERT INTO users (id, username, email, password) VALUES(DEFAULT, $1, $2, $3) RETURNING *', [username, email, pswhash]);
    }

    const updateUsername = async function(userID, username){
        return await runQuery('UPDATE users SET username = $2 WHERE id = $1 RETURNING *', [userID, username]);
    }

    const updateUserEmail = async function(userID, email){
        return await runQuery('UPDATE users SET email = $2 WHERE id = $1 RETURNING *', [userID, email]);
    }

    const updateUserPassword = async function(userID, pswhash){
        return await runQuery('UPDATE users SET password = $2 WHERE id = $1 RETURNING *', [userID, pswhash]);
    }

    const deleteUserAccount = async function(userID){
        return await runQuery('DELETE FROM users WHERE id = $1', [userID]);
    }

    const makeNewPresentation = async function(presentation, visibility){
        return await runQuery('INSERT INTO presentation (id, presentation, visibility) VALUES(DEFAULT, $1, $2) RETURNING *', [presentation, visibility])
    }

    const getPresentationById = async function(presentationId){
        return await runQuery('SELECT * FROM presentation WHERE id = $1', [presentationId]);
    }

    const updatePresentation = async function(presentationID, presentationObj){
        return await runQuery('UPDATE presentation SET presentation = $2 WHERE id = $1 RETURNING *', [presentationID, presentationObj]);
    }

    return {
        getUserByUsername: getUserByUsername,
        getUserByID: getUserByID,
        makeUserAccount: makeUserAccount,
        makeNewPresentation: makeNewPresentation,
        getPresentationById: getPresentationById,
        updatePresentation: updatePresentation,
        updateUsername: updateUsername,
        updateUserEmail: updateUserEmail,
        updateUserPassword: updateUserPassword,
        deleteUserAccount: deleteUserAccount
    }
};

module.exports = db;