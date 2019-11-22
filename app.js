const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const presentationRouter = require('./routes/presentation');

const app = express();
const DEFAULT_PORT = 8080;

app.use(cors());
app.set('port', (process.env.PORT || DEFAULT_PORT));
app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/users', usersRouter);
app.use('/presentations', presentationRouter);

app.listen(app.get('port'), function () {
    console.log('server running', app.get('port'));
});

