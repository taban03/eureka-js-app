const express = require('express')
const https = require('https');
const fs = require('fs')
    , path = require('path')
    , certFile = path.resolve(__dirname, '../ssl/localhost.keystore.cer')
    , keyFile = path.resolve(__dirname, '../ssl/localhost.keystore.key')
    , caFile = path.resolve(__dirname, '../ssl/localhost.pem')
const app = express()
const port = 8081

module.exports = {
    startServer: function () {
        app.get('/', (req, res) => res.send('Hello World!'));
        https
            .createServer(
                {
                    cert: fs.readFileSync(certFile),
                    key: fs.readFileSync(keyFile),
                },
                app
            )
            .listen(port, () => console.log(`Service listening at https://localhost:${port}`));
    }
}

