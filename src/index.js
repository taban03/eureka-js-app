const Eureka = require('eureka-js-client').Eureka;
const yaml = require('js-yaml');
const fs = require('fs');

let certFile = null;
let keyFile = null;
let caFile = null;
let passPhrase = null;

// Read ssl service configuration
function readTlsProps() {
    try {
        const config = yaml.load(fs.readFileSync('config/service-configuration.yml', 'utf8'));
        certFile = config.ssl.certificate;
        keyFile = config.ssl.keystore;
        caFile = config.ssl.caFile;
        passPhrase = config.ssl.keyPassword;

    } catch (e) {
        console.log(e);
    }
}
readTlsProps();

let tlsOptions = {
    cert: fs.readFileSync(certFile),
    key: fs.readFileSync(keyFile),
    passphrase: passPhrase,
    ca: fs.readFileSync(caFile)
};

const client = new Eureka({
    filename: 'service-configuration',
    cwd: 'config/',
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



