const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const should = chai.should();

const utils = require('../../../src/utils');

describe('Utils for strings', () => {

  it('A project name with camelcase, whitespaces and underscore get normalized', async () => {
    const testPath = path.resolve(path.join('temp', 'un_Gran proyECTO'));
    utils.string.normalizeName(testPath).should.equal('un-gran-proyecto');
  });

  it('Replace a string using a dictionary', async () => {
    const dictionary = {
      FIRST: 'first element',
      SECOND: 'second element',
      THIRD: 'third element',
    };

    const theString = 'On the FIRST the things get weird for this THIRD test.';

    const replaced = utils.string.replaceByDictionary(theString, dictionary);

    replaced.should.equal('On the first element the things get weird for this third element test.');
  });
});
