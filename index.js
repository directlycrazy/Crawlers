const express = require('express');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(require('./src/router.js'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.listen(process.env.PORT || 3000);