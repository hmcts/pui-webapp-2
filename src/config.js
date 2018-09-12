// Read from ENV in prod somehow?
var config = {
    sessionSecret: 's3cretSauc3',
    secureCookie: false, // this needs to be 'true' in prod and needs https encryption to be used
    idam: {
        indexUrl: '/',
        idamApiUrl: 'https://preprod-idamapi.reform.hmcts.net:3511',
        idamLoginUrl: 'https://idam.preprod.ccidam.reform.hmcts.net/login',
        idamSecret: 'TZdHXaDbvZTfNy6U',
        idamClientID: 'juiwebapp',
        redirectUri: 'http://localhost:4001/oauth2/callback'
    },
    proxy: {
        host: '172.16.0.7',
        port: 8080
    }
    core: {
        components: {
            "idam" : "PUICreateIdamComponent"
        }
    }
}

module.exports = config
