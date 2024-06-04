import { expect } from 'chai';
import { getStem, imagePathBuilder, pathBuilder } from './paths';
import { CONSTS } from '../../CONSTS';
const { VERSION } = CONSTS;

describe('paths', () => {
  /**
   * A function that takes a string as input and returns the same string.
   * @param {string} str - The string to be returned.
   * @returns {string} The input string.
   */
  function mockRender(str) {
    return str;
  }

  describe('getStem', () => {
    it('has arity of 1', () => {
      expect(getStem.length).to.eq(1);
    });
  });

  describe('imagePathBuilder', () => {
    it('has arity of 1', () => {
      expect(imagePathBuilder.length).to.eq(1);
    });
    it('returns the correct function', () => {
      expect(imagePathBuilder('en').length).to.eq(2);
    });

    it('returns the correct value for en', () => {
      expect(imagePathBuilder('en')()('/images/cat.gif', mockRender)).to.eq(
        `/${VERSION}/images/cat.gif`
      );
    });

    it('returns the correct value for de', () => {
      expect(imagePathBuilder('de')()('/images/cat.gif', mockRender)).to.eq(
        `/${VERSION}/images/cat.gif`
      );
    });
  });

  describe('pathBuilder', () => {
    it('has arity of 1', () => {
      expect(pathBuilder.length).to.eq(1);
    });
    it('returns the correct function', () => {
      expect(pathBuilder('en')().length).to.eq(2);
    });

    it('returns the correct value for en', () => {
      expect(pathBuilder('en')()('cat.html', mockRender)).to.eq(
        `/${VERSION}/cat.html`
      );
    });

    it('returns the correct value for de', () => {
      expect(pathBuilder('de')()('cat.html', mockRender)).to.eq(
        `/${VERSION}/cat.html`
      );
    });
  });
});
