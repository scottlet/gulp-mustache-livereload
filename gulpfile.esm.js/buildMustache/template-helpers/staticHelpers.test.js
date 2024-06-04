import { expect } from 'chai';
import { getStaticHelpers } from './staticHelpers';
import { CONSTS } from '../../CONSTS';

import { useFakeTimers, spy } from 'sinon';

const { VERSION, NAME, HOST, PATH, NODE_ENV } = CONSTS;

const staticHelpers = getStaticHelpers();

describe('staticHelpers', () => {
  const mockHandles = {
    fn: spy(),
    inverse: spy()
  };

  /**
   * A function that takes a string as input and returns the same string.
   * @param {string} str - The string to be returned.
   * @returns {string} The input string.
   */
  function mockRender(str) {
    return str;
  }

  beforeEach(function () {
    // eslint-disable-next-line no-magic-numbers
    this.clock = useFakeTimers(149472000000);
  });

  afterEach(function () {
    this.clock.restore();
    mockHandles.fn.resetHistory();
    mockHandles.inverse.resetHistory();
  });
  describe('uc', () => {
    it('has an arity of one', () => {
      expect(staticHelpers.uc.length).to.eq(1);
    });

    it('uppercases ‘me’', () => {
      expect(staticHelpers.uc('me')).to.eq('ME');
    });
  });

  describe('capitalise', () => {
    it('has an arity of two', () => {
      expect(staticHelpers.capitalise().length).to.eq(2);
    });

    it('uppercases ‘me’', () => {
      expect(staticHelpers.capitalise()('me', mockRender)).to.eq('ME');
    });
  });

  describe('lc', () => {
    it('has an arity of two', () => {
      expect(staticHelpers.lc().length).to.eq(2);
    });

    it('lowercases ‘ME’', () => {
      expect(staticHelpers.lc()('ME', mockRender)).to.eq('me');
    });
  });

  describe('str', () => {
    it('has an arity of two', () => {
      expect(staticHelpers.str().length).to.eq(2);
    });

    it('make a string out of 1', () => {
      expect(staticHelpers.str()(1, mockRender)).to.eq('1');
    });
  });

  describe('inc', () => {
    it('has an arity of two', () => {
      expect(staticHelpers.inc().length).to.eq(2);
    });

    it('Increments the number passed by 1', () => {
      expect(staticHelpers.inc()(1, mockRender)).to.eq(2);
    });
  });

  describe('hostname', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.hostname.length).to.eq(0);
    });

    it('returns the hostname', () => {
      expect(staticHelpers.hostname()).to.eq(HOST);
    });
  });

  describe('hostpath', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.hostpath.length).to.eq(0);
    });

    it('returns the hostpath', () => {
      expect(staticHelpers.hostpath()).to.eq(PATH);
    });
  });

  describe('production', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.production.length).to.eq(0);
    });

    it('returns true if running in production, false if not', () => {
      expect(staticHelpers.production()).to.eq(NODE_ENV === 'production');
    });
  });

  describe('name', () => {
    it('returns name from package.json', () => {
      expect(staticHelpers.name).to.eq(NAME);
    });
  });
  describe('version', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.version.length).to.eq(0);
    });

    it('returns version from package.json', () => {
      expect(staticHelpers.version()).to.eq(VERSION);
    });
  });

  describe('datestamp', () => {
    it('has an arity of 0', () => {
      expect(staticHelpers.datestamp.length).to.eq(0);
    });

    it('returns datestamp for now', () => {
      expect(staticHelpers.datestamp()).to.eq(Date.now());
    });
  });
});
