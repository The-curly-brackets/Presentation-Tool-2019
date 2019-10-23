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

    const getUserByID = async function (userID) {
        return await runQuery('SELECT * FROM users WHERE id = $1', [userID]);
    };

    return {
        getUserByID: getUserByID
    }
};

module.exports = db;