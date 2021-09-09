const nock = require('nock');
const { getMock, getMockAsJSON } = require('./helpers/utils');
const { getAppInstallationAuth } = require('../src/lib');

process.on('unhandledRejection', console.warn);

describe('lib unit tests', () => {
  beforeAll(() => {
    nock.disableNetConnect;
  });

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.restore();
    jest.resetModules();
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_ACTION;
    delete process.env.INPUT_GITHUB_TOKEN;
    delete process.env.INPUT_APP_ID;
    delete process.env.INPUT_PRIVATE_KEY;
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('getAppInstallationAuth: given an org appId and privateKey when valid credentials then return installation auth', async () => {
    expect.assertions(1);

    const mockOrganization = 'amazing-github-actions';
    const mockAppId = '133386';
    const mockPrivateKey = await getMock('mock-cert.pem');
    const mockOwner = mockOrganization;
    const mockInstallationId = '19373584';
    const mockAppToken = 'ghs_***';

    nock('https://api.github.com')
      .get('/app')
      .reply(200, await getMockAsJSON('org-app.json'));

    nock('https://api.github.com')
      .get(`/orgs/${mockOrganization}/installation`)
      .reply(200, await getMockAsJSON('org-installation.json'));

    nock('https://api.github.com')
      .post(`/app/installations/${mockInstallationId}/access_tokens`)
      .reply(201, await getMockAsJSON('token.json'));

    const token = await getAppInstallationAuth(
      mockOwner,
      mockAppId,
      mockPrivateKey,
    );

    expect(token).toBe(mockAppToken);
  });

  test('getAppInstallationAuth: given a user appId and privateKey when valid credentials then return installation auth', async () => {
    expect.assertions(1);

    const mockAppId = '133321';
    const mockPrivateKey = await getMock('mock-cert.pem');
    const mockUser = 'tcblome';
    const mockOwner = mockUser;
    const mockInstallationId = '18981522';
    const mockAppToken = 'ghs_***';

    nock('https://api.github.com')
      .get('/app')
      .reply(200, await getMockAsJSON('user-app.json'));

    nock('https://api.github.com')
      .get(`/users/${mockUser}/installation`)
      .reply(200, await getMockAsJSON('user-installation.json'));

    nock('https://api.github.com')
      .post(`/app/installations/${mockInstallationId}/access_tokens`)
      .reply(201, await getMockAsJSON('token.json'));

    const token = await getAppInstallationAuth(
      mockOwner,
      mockAppId,
      mockPrivateKey,
    );

    expect(token).toBe(mockAppToken);
  });

  test('getAppInstallationAuth: given an org appId and malformed privateKey then throw error', async () => {
    expect.assertions(1);

    const mockAppId = '133386';
    const mockOrganization = 'amazing-github-actions';
    const mockOwner = mockOrganization;

    await expect(
      getAppInstallationAuth(mockOwner, mockAppId, 'mockBadPrivateKey'),
    ).rejects.toThrow('error:0909006C:PEM routines:get_name:no start line');
  });
});
