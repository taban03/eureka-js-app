const Eureka = require('eureka-js-client').Eureka;
const fs = require('fs')
    , path = require('path')
    , certFile = path.resolve(__dirname, '../ssl/localhost.keystore.cer')
    , keyFile = path.resolve(__dirname, '../ssl/localhost.keystore.key')
    , caFile = path.resolve(__dirname, '../ssl/localhost.pem')



let tlsOptions = {
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile),
    passphrase: 'password',
    ca: fs.readFileSync(caFile)
}

const client = new Eureka({
    filename: 'eureka-client',
    cwd: '/Users/at670475/IntelliJProjects/nodejs_enabler/eureka-js-app/helloworld-expressjs',
    eureka: {
        // eureka server host / port
        host: 'localhost',
        port: 10011,
        servicePath: '/eureka/apps/',
        ssl: true
    },
    requestMiddleware: (requestOpts, done) => {
        done(Object.assign(requestOpts, tlsOptions));
    }
});

function connectToEureka() {
    client.logger.level('debug');
    client.start(function(error) {
        console.log(JSON.stringify(error) || 'Eureka registration complete');   });
}

connectToEureka();

module.exports = {connectToEureka, tlsOptions};



