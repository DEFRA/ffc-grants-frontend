const cookie = require('@hapi/cookie')
const authConfig = require('../../../app/config/auth')
const urlPrefix = require('../../../app/config/server').urlPrefix
const auth = require('../../../app/plugins/auth');

jest.mock('../../../app/server', () => {
    return jest.fn().mockImplementation(() => {
        return {
            register: jest.fn(),
            start: () => { },
            stop: () => { },
            route: () => { },
            views: () => { },
            info: {
                created: 1666795964619,
                host: "mock-host",
                id: "mock-host:18:id",
                port: 3000,
                protocol: "http",
                started: 0,
                uri: "http://localhost:3000",
            },
        }
    })
});


jest.mock('@hapi/cookie');
jest.mock('../../../app/config/auth', () => ({
    cookie: 'cookie',
    credentials: {
        username: 'username',
        password: 'password',
    }
}));
jest.mock('../../../app/config/server', () => ({
    urlPrefix: 'urlPrefix',
    cookieOptions: {
        isSecure: true,
    }
    }));


describe('auth', () => {
    it('should have a name property', () => {
        expect(auth.plugin.name).toEqual('auth');
    });

    it('should register the auth plugin', async () => {
        const server = {
            register: jest.fn(),
            auth: {
                strategy: jest.fn(),
                default: jest.fn()
            }
        };

        await auth.plugin.register(server);

        expect(server.register).toHaveBeenCalledWith(cookie);
        expect(server.auth.strategy).toHaveBeenCalledWith('session-auth', 'cookie', {
            cookie: authConfig.cookie,
            redirectTo: `${urlPrefix}/login`,
            validateFunc: expect.any(Function)
        });
        expect(server.auth.default).toHaveBeenCalledWith('session-auth');
    });
});
