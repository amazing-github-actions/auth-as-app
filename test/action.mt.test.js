const cp = require('child_process');

jest.setTimeout(180000);

describe('GitHub Action manaual tests', () => {
  beforeAll(() => {
    process.env = Object.assign(process.env, {});
  });

  afterAll(() => {});

  test('act: given the action when user workflow then exit', () => {
    return new Promise((done) => {
      expect.assertions(2);
      const cmd = '/usr/local/bin/act';
      const args = ['--job', 'acceptance'];

      const act = cp.spawn(cmd, args);

      act.on('error', (err) => {
        console.error(`${cmd} failed with ${err.message}`);
        done();
      });

      let stdout = '';

      act.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      act.stderr.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      act.on('close', (code) => {
        console.log(stdout);
        if (code != 0) {
          done();
        }
        expect(code).toBe(0);
        expect(stdout).toMatch(/ {3}✅ {2}Success - . /);
        done();
      });
    });
  });
});
