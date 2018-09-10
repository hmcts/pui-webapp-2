// Read from ENV in prod somehow?
var config = {
    sessionSecret: 's3cretSauc3',
    secureCookie: false, // this needs to be 'true' in prod and needs https encryption to be used
    idam: {
        indexUrl: '/index',
        idamApiUrl: 'https://preprod-idamapi.reform.hmcts.net:3511',
        idamLoginUrl: 'http://idam.preprod.ccidam.reform.hmcts.net/login',
        idamSecret: 'TZdHXaDbvZTfNy6U',
        idamClientID: 'juiwebapp'
    }
}

module.exports = config
