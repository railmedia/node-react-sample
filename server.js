const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const http = require('http');
const connect = require('connect');
const serveStatic = require('serve-static');
const path = require('path');
dotenv.config();

const users = require('./routes/api/users');
const sites = require('./routes/api/sites');
const settings = require('./routes/api/settings');
const requests = require('./routes/api/requests');
const logs = require('./routes/api/logs');
const merchants = require('./routes/api/merchants');
//const dashboard = require('./routes/frontend/dashboard');

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use( bodyParser.json() );

const db = process.env.MONGO_URI;

mongoose.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(
    () => console.log('DB successfully connected')
).catch(
    err => console.log(err)
);

require('./models/User');
require('./models/Site');
require('./models/Setting');
require('./models/Log');
require('./models/Merchant');

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/sites', sites);
app.use('/api/settings', settings);
app.use('/api/requests', requests);
app.use('/api/logs', logs);
app.use('/api/merchants', merchants);


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
 
