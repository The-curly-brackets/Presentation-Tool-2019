const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const DEFAULT_PORT = 8080;
const db_credentials = process.env.DATABASE_URL || "postgres://jksoyjotdnrhsk:33d18816c28a98b69b2eb4022834ab1a5a273468828feace7172dc1e038c57f8@ec2-46-137-188-105.eu-west-1.compute.amazonaws.com:5432/d30m6bu4nsdneh";

const client = new Client({
    connectionString: db_credentials,
    ssl: true,
});

client.connect();

app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/', function (req, res, next) {
    client.query('SELECT * FROM users', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
});


app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});