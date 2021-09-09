const { readFileSync } = require('fs');
const { resolve } = require('path');

const fixturesPath = './test/fixtures';

const getMock = async (fileName) => {
  return readFileSync(resolve(fixturesPath, fileName), 'utf8');
};

const getMockAsJSON = async (fileName) => {
  const mock = await getMock(fileName);
  return JSON.parse(mock);
};

module.exports = { getMock, getMockAsJSON };
