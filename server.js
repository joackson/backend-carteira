const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

var routes = require('./routes/routes'); //importing route
app.use(cors())

routes(app); //register the route

app.listen(process.env.PORT || 8000, () => {
    console.log('Server started on port: ' + process.env.PORT);
});
