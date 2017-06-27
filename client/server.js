const express = require('express');

const app = express();

app.use(express.static('./node_modules/watson-react-components/dist/'));

app.get("/", function(req, res) {
    res.send("Helo")
})