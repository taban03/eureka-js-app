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

// example configuration
const client = new Eureka({
    // application instance information
    instance: {
        instanceId: "localhost:samplenodeservice:8543",
        app: "samplenodeservice",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        vipAddress: "localhost",
        status: "UP",
        port: {
            "$": 8081,
            "@enabled": true
        },
        securePort: {
            "$": 0,
            "@enabled": false
        },
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        },
        leaseInfo: {
            durationInSecs: 90, // 3 * heartbeatInterval
            renewalIntervalInSecs: 30 // heartbeatInterval
        },
        metadata: {},
    },
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

client.start();