const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const app = express();
const DEFAULT_PORT = 8080;

app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/users', usersRouter);

app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});