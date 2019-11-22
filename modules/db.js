const pg = require("pg");
const hash = require("./hash");

const db = function (dbConnectionString) {

    async function runQuery(query, params) {
        const client = new pg.Client({
            connectionString: dbConnectionString,
            ssl: true
        });

        client.connect();

        return client.query(query, params)
            .then(res => {
                if (res.rows.length > 1) {
                    return res.rows;
                } else {
                    return res.rows[0];
                }
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
        return await runQuery('SELECT * FROM users WHERE username = $1', [username])
            .then(user => {
                let psw = JSON.parse(user.password);
                user.valid = hash.hash(password, psw.salt).passwordHash === psw.passwordHash;
                return user;
            });
    };

    const makeUserAccount = async function (username, email, pswhash) {
        return await runQuery('INSERT INTO users (id, username, email, password) VALUES(DEFAULT, $1, $2, $3) RETURNING *', [username, email, pswhash]);
    };

    const getPresentationById = async function (presentationID) {
        return await runQuery('SELECT * FROM presentation WHERE id = $1', [presentationID]);
    };

    const checkUserIsAuthor = async function (userID, presentationID) {
        return await runQuery('SELECT * FROM "user_isAuthor_presentation" WHERE "user_isAuthor_presentation"."userId" = $1 AND "user_isAuthor_presentation"."presentationId" = $2', [userID, presentationID]);
    };

    const updateExistingPresentation = async function (presentation, presentationID) {
        return await runQuery('UPDATE presentation SET presentation = $1 WHERE id = $2 RETURNING id', [presentation, presentationID]);
    };

    const deleteExistingPresentation = async function (presentationID) {
        return await runQuery('DELETE FROM "user_isAuthor_presentation" WHERE "user_isAuthor_presentation"."presentationId" = $1 RETURNING *', [presentationID]).then(succsess => {
            console.log(succsess);
            return runQuery('DELETE FROM presentation WHERE id=$1', [presentationID])
        });
    };
    const createPresentation = async function (userID, presentation) {
        return await runQuery("INSERT INTO presentation (presentation, visibility, name, date) VALUES (CAST($1 AS json), 1, $2, $3) RETURNING id", [presentation, presentation.name, presentation.date]).then(presentationID => {
            return runQuery('INSERT INTO "user_isAuthor_presentation" ("userId", "presentationId") VALUES ($1, $2) RETURNING "presentationId"', [userID, presentationID.id]);
        });
    };

    const updateUsername = async function(userID, username){
        return await runQuery('UPDATE users SET username = $2 WHERE id = $1 RETURNING *', [userID, username]);
    };

    const updateUserEmail = async function(userID, email){
        return await runQuery('UPDATE users SET email = $2 WHERE id = $1 RETURNING *', [userID, email]);
    };

    const updateUserPassword = async function(userID, pswhash){
        return await runQuery('UPDATE users SET password = $2 WHERE id = $1 RETURNING *', [userID, pswhash]);
    };

    const getAllPresentationFromUser = async function(userId) {
        return await runQuery('SELECT id, name, date FROM presentation INNER JOIN "user_isAuthor_presentation" ON presentation.id = "user_isAuthor_presentation"."presentationId" WHERE "user_isAuthor_presentation"."userId" = $1', [userId])
    };

    const deleteUserAccount = async function(userID){
        return await runQuery('DELETE FROM "user_isAuthor_presentation" WHERE "user_isAuthor_presentation"."userId" = $1', [userID]).then(succses => {
            return runQuery ('DELETE FROM users WHERE id = $1', [userID]);
        });
    }

    return {
        getUserByID: getUserByID,
        getUserByNameAndPassword: getUserByNameAndPassword,
        getUserByUsername: getUserByUsername,
        getPresentationById: getPresentationById,
        makeUserAccount: makeUserAccount,
        checkUserIsAuthor: checkUserIsAuthor,
        updateExistingPresentation: updateExistingPresentation,
        deleteExistingPresentation: deleteExistingPresentation,
        createPresentation: createPresentation,
        updateUsername: updateUsername,
        updateUserEmail: updateUserEmail,
        updateUserPassword: updateUserPassword,
        getAllPresentationFromUser: getAllPresentationFromUser,
        deleteUserAccount: deleteUserAccount
    }

};

module.exports = db;