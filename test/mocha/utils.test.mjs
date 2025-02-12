import { expect } from 'chai';

import { getAbbreviation } from '../../src/utils.mjs';

describe('Inline copy component', () => {
  it('Abbreviates addresses correctly', () => {
    expect(getAbbreviation('0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb', '5,4'))
      .to.equal('0xc9B...3EAb');
    expect(getAbbreviation('sr1Ghq66tYK9y3r8CC1Tf8i8m5nxh8nTvZEf', '6,4'))
      .to.equal('sr1Ghq...vZEf');
    expect(getAbbreviation('1234567890', '6,4'))
      .to.equal('1234567890');
    expect(getAbbreviation('123', '6,4'))
      .to.equal('123');
  });

  it('Throws errors correctly', () => {
    expect(() => getAbbreviation('ABC', 'DEF')).to.throw();
  })
});
