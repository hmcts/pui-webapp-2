// Read from ENV in prod somehow?
var config = {
    sessionSecret: 's3cretSauc3',
    secureCookie: false, // this needs to be 'true' in prod and needs https encryption to be used
    proxy: {
        host: '172.16.0.7',
        port: 8080
    },
    core: {
        components: [
            {
                idam: {
                    class: 'PUICreateIdamComponent',
                    config: {
                        routingPrefix: '/idam',
                        idam: {
                            indexUrl: '/',
                            idamApiUrl: 'https://preprod-idamapi.reform.hmcts.net:3511',
                            idamLoginUrl: 'https://idam.preprod.ccidam.reform.hmcts.net/login',
                            idamSecret: 'TZdHXaDbvZTfNy6U',
                            idamClientID: 'juiwebapp',
                            redirectUri: 'http://localhost:4001/oauth2/callback'
                        },
                        insecure: ['/']
                    }
                }
            },
            {
                createAccount: {
                    class: 'PUICreateAccountComponent',
                    file: 'create-account.js',
                    config: {
                        routingPrefix: '/create-account',
                        linkToCreateCasePage: '/create-case',
                        linkToManageCasePage: '/manage-case'
                    }
                }
            }
        ]
    }
}

module.exports = config
