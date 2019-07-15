import includes from '../src/array-includes-x';

const itHasDoc = typeof document !== 'undefined' && document ? it : xit;

describe('includes', function() {
  let sparseish;
  let overfullarrayish;
  let numberish;

  /* eslint-disable-next-line jest/no-hooks */
  beforeEach(function() {
    sparseish = {
      0: 'a',
      1: 'b',
      length: 5,
    };

    overfullarrayish = {
      0: 'a',
      1: 'b',
      2: 'c',
      length: 2,
    };

    numberish = {
      valueOf() {
        return 2;
      },
    };
  });

  it('is a function', function() {
    expect.assertions(1);
    expect(typeof includes).toBe('function');
  });

  it('should throw when target is null or undefined', function() {
    expect.assertions(3);
    expect(function() {
      includes();
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      /* eslint-disable-next-line no-void */
      includes(void 0);
    }).toThrowErrorMatchingSnapshot();

    expect(function() {
      includes(null);
    }).toThrowErrorMatchingSnapshot();
  });

  it('simple examples', function() {
    expect.assertions(3);
    expect(includes([1, 2, 3], 1)).toBe(true, '[1, 2, 3] includes 1');
    expect(includes([1, 2, 3], 4)).toBe(false, '[1, 2, 3] does not include 4');
    expect(includes([NaN], NaN)).toBe(true, '[NaN] includes NaN');
  });

  it('does not skip holes', function() {
    expect.assertions(1);
    expect(includes(Array(1))).toBe(true, 'Array(1) includes undefined');
  });

  it('arraylike', function() {
    expect.assertions(5);
    expect(includes(sparseish, 'a')).toBe(true, 'sparse array-like object includes "a"');
    expect(includes(sparseish, 'c')).toBe(false, 'sparse array-like object does not include "c"');

    expect(includes(overfullarrayish, 'b')).toBe(true, 'sparse array-like object includes "b"');
    expect(includes(overfullarrayish, 'c')).toBe(false, 'sparse array-like object does not include "c"');

    expect(includes('abc', 'c')).toBe(true, 'string includes "c"');
  });

  describe('fromIndex', function() {
    it('number coercion', function() {
      expect.assertions(5);
      expect(includes([1], 1, NaN)).toBe(true, 'NaN fromIndex -> 0 fromIndex');
      expect(includes(['a', 'b', 'c'], 'a', numberish)).toBe(false, 'does not find "a" with object fromIndex coercing to 2');
      expect(includes(['a', 'b', 'c'], 'a', '2')).toBe(false, 'does not find "a" with string fromIndex coercing to 2');
      expect(includes(['a', 'b', 'c'], 'c', numberish)).toBe(true, 'finds "c" with object fromIndex coercing to 2');
      expect(includes(['a', 'b', 'c'], 'c', '2')).toBe(true, 'finds "c" with string fromIndex coercing to 2');
    });

    it('fromIndex greater than length', function() {
      expect.assertions(4);
      expect(includes([1], 1, 2)).toBe(false, 'array of length 1 is not searched if fromIndex is > 1');
      expect(includes([1], 1, 1)).toBe(false, 'array of length 1 is not searched if fromIndex is >= 1');
      expect(includes([1], 1, 1.1)).toBe(false, 'array of length 1 is not searched if fromIndex is 1.1');
      expect(includes([1], 1, Infinity)).toBe(false, 'array of length 1 is not searched if fromIndex is Infinity');
    });

    it('negative fromIndex', function() {
      expect.assertions(9);
      expect(includes([1, 3], 1, -4)).toBe(true, 'computed length would be negative; fromIndex is thus 0');
      expect(includes([1, 3], 3, -4)).toBe(true, 'computed length would be negative; fromIndex is thus 0');
      expect(includes([1, 3], 1, -Infinity)).toBe(true, 'computed length would be negative; fromIndex is thus 0');

      expect(includes([12, 13], 13, -1)).toBe(true, 'finds -1st item with -1 fromIndex');
      expect(includes([12, 13], 12, -1)).toBe(false, 'does not find -2nd item with -1 fromIndex');
      expect(includes([12, 13], 13, -2)).toBe(true, 'finds -2nd item with -2 fromIndex');

      expect(includes(sparseish, 'b', -4)).toBe(true, 'finds -4th item with -4 fromIndex');
      expect(includes(sparseish, 'a', -4)).toBe(false, 'does not find -5th item with -4 fromIndex');
      expect(includes(sparseish, 'a', -5)).toBe(true, 'finds -5th item with -5 fromIndex');
    });

    it('uses same value zero', function() {
      expect.assertions(1);
      expect(includes([-0], 0)).toBe(true);
    });

    it('should work with strings', function() {
      expect.assertions(1);
      expect(includes('abc', 'b')).toBe(true);
    });

    it('should work with arguments', function() {
      expect.assertions(1);
      const obj = (function getArgs() {
        /* eslint-disable-next-line prefer-rest-params */
        return arguments;
      })('a', 'b', 'c');

      expect(includes(obj, 'b')).toBe(true);
    });

    itHasDoc('should work wih DOM elements', function() {
      expect.assertions(1);
      const fragment = document.createDocumentFragment();
      const div = document.createElement('div');
      fragment.appendChild(div);
      expect(includes(fragment.childNodes, div)).toBe(true);
    });
  });
});
