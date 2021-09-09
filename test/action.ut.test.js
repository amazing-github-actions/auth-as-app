const { getMock } = require('./helpers/utils');

describe('action', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_ACTION;
    delete process.env.INPUT_GITHUB_TOKEN;
    delete process.env.INPUT_APP_ID;
    delete process.env.INPUT_PRIVATE_KEY;
  });

  test('run()', async () => {
    expect.assertions(5);

    const mockRepo = 'mock/mock';
    const mockOwner = 'tcblome';
    const mockGitHubToken = '12345677890987654321';
    const mockAppId = '180095';
    const mockPrivateKey = await getMock('mock-cert.base64');
    const mockAppToken = 'ghs_***';

    process.env = Object.assign(process.env, {
      GITHUB_REPOSITORY: mockRepo,
      INPUT_OWNER: mockOwner,
      INPUT_GITHUB_TOKEN: mockGitHubToken,
      INPUT_APP_ID: mockAppId,
      INPUT_PRIVATE_KEY: mockPrivateKey,
    });

    const core = require('@actions/core');
    const mockGetInput = jest.spyOn(core, 'getInput');

    jest.doMock('../src/lib', () => {
      return {
        getAppInstallationAuth: jest
          .fn()
          .mockImplementation(() => mockAppToken),
      };
    });

    const lib = require('../src/lib');

    const mockGetAppInstallationAuth = jest.spyOn(
      lib,
      'getAppInstallationAuth',
    );

    const { run } = require('../src/action');
    await run();

    expect(mockGetInput).toHaveBeenCalledTimes(3);
    expect(mockGetInput).toHaveBeenCalledWith('owner', { required: true });
    expect(mockGetInput).toHaveBeenCalledWith('app_id', { required: true });
    expect(mockGetInput).toHaveBeenCalledWith('private_key', {
      required: true,
    });

    expect(mockGetAppInstallationAuth).toHaveBeenCalledWith(
      mockOwner,
      mockAppId,
      await getMock('mock-cert.pem'),
    );
  });
});
