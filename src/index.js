const Eureka = require('eureka-js-client').Eureka;
const fs = require('fs')
    , path = require('path')
    , certFile = path.resolve(__dirname, '../ssl/localhost.keystore.cer')
    , keyFile = path.resolve(__dirname, '../ssl/localhost.keystore.key')
    , caFile = path.resolve(__dirname, '../ssl/localhost.pem')

const server = require('./server');
server.startServer();


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
        instanceId: "localhost:samplenodeservice:8081",
        app: "SAMPLENODESERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        vipAddress: "samplenodeservice",
        secureVipAddress: "samplenodeservice",
        status: "UP",
        port: {
            "$": 0,
            "@enabled": false
        },
        securePort: {
            "$": 8081,
            "@enabled": true
        },
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        },
        metadata: {
            "routed-services.1.gateway-url": "/api/v1",
            "routed-services.1.service-url": "/",

            'mfaas.discovery.catalogUiTile.id': 'samplenodeservice',
            'mfaas.discovery.catalogUiTile.title': 'Zowe Sample Node Service',
            'mfaas.discovery.catalogUiTile.description': 'Sample service running '
                + 'under NodeJS and registering into API Mediation Layer\'s Discovery service ',
            'mfaas.discovery.catalogUiTile.version': '1.0.0',

            'mfaas.discovery.service.title': 'Zowe Sample Node Service',
            'mfaas.discovery.service.description': 'The Proxy Server is an HTTP, '
                + 'HTTPS, and Websocket server built upon NodeJS and ExpressJS.',

            'mfaas.api-info.apiVersionProperties.v1.title': 'Zowe Sample Node Service API',
            'mfaas.api-info.apiVersionProperties.v1.description': 'An API for the Zowe Sample Node Service ',
            'mfaas.api-info.apiVersionProperties.v1.version': '1.0.0'
        },
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