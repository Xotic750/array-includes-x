/**
 * @file Determines whether an array includes a certain element.
 * @version 2.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-includes-x
 */

const nativeIncludes = typeof Array.prototype.includes === 'function' && Array.prototype.includes;

let isWorking;

if (nativeIncludes) {
  const attempt = require('attempt-x');
  let arr;

  // eslint-disable-next-line no-useless-call
  let res = attempt.call(null, nativeIncludes, 'a');
  isWorking = res.threw;

  if (isWorking) {
    arr = {
      1: 'a',
      2: NaN,
      3: -0,
      length: 5,
    };

    res = attempt.call(arr, nativeIncludes, void 0, -1);
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    res = attempt.call(arr, nativeIncludes, NaN);
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    res = attempt.call(arr, nativeIncludes, 0);
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    const testArr = [];
    testArr.length = 2;
    testArr[1] = null;
    res = attempt.call(testArr, nativeIncludes, void 0);
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    res = attempt.call('abc', nativeIncludes, 'c');
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    res = attempt.call(
      (function() {
        return arguments;
      })('a', 'b', 'c'),
      nativeIncludes,
      'c',
    );
    isWorking = res.threw === false && res.value === true;
  }
}

let $includes;

if (isWorking) {
  $includes = function includes(array, searchElement) {
    const args = [searchElement];

    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return nativeIncludes.apply(array, args);
  };
} else {
  const toObject = require('to-object-x');
  const isUndefined = require('validate.io-undefined');
  const toLength = require('to-length-x');
  const sameValueZero = require('same-value-zero-x');
  const findIndex = require('find-index-x');
  const splitIfBoxedBug = require('split-if-boxed-bug-x');
  const indexOf = require('index-of-x');
  const calcFromIndex = require('calculate-from-index-x');

  /*
   * This method returns an index in the array, if an element in the array
   * satisfies the provided testing function. Otherwise -1 is returned.
   *
   * @private
   * @param {Array} object - The array to search.
   * @param {*} searchElement - Element to locate in the array.
   * @param {number} fromIndex - The index to start the search at.
   * @returns {number} Returns index of found element, otherwise -1.
   */
  const findIdxFrom = function findIndexFrom(object, searchElement, fromIndex) {
    let fIdx = fromIndex;
    const length = toLength(object.length);
    while (fIdx < length) {
      if (sameValueZero(object[fIdx], searchElement)) {
        return fIdx;
      }

      fIdx += 1;
    }

    return -1;
  };

  $includes = function includes(array, searchElement) {
    const object = toObject(array);
    const iterable = splitIfBoxedBug(object);
    const length = toLength(iterable.length);

    if (length < 1) {
      return -1;
    }

    if (isUndefined(searchElement)) {
      let fromIndex = calcFromIndex(iterable, arguments[2]);

      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }

      if (fromIndex > 0) {
        return findIdxFrom(iterable, searchElement, fromIndex) > -1;
      }

      return (
        findIndex(iterable, function(element) {
          return sameValueZero(searchElement, element);
        }) > -1
      );
    }

    return indexOf(iterable, searchElement, arguments[2], 'samevaluezero') > -1;
  };
}

/**
 * This method determines whether an array includes a certain element,
 * returning true or false as appropriate.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If `array` is `null` or `undefined`.
 * @param {*} searchElement - Element to locate in the `array`.
 * @param {number} [fromIndex] - The position in this array at which to begin
 *  searching for searchElement. A negative value searches from the index of
 *  array.length + fromIndex by asc. Defaults to 0.
 * @returns {boolean} `true` if searched element is included; otherwise `false`.
 * @example
 * var includes = require('array-includes-x');
 *
 * var subject = [2, 3, undefined, true, 'hej', null, 2, false, 0, -0, NaN];
 * includes(subject, undefined); // true
 * includes(subject, undefined, 3); // false
 * includes(subject, NaN); // true
 * includes(subject, 10); // false
 *
 */
module.exports = $includes;
