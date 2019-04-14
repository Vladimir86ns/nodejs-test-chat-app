const path = require('path');
var express = require('express')
var app = express()

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.listen(port , () => {
    console.log(`servet is up on port ${port}!! `);
})