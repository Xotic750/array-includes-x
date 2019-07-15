function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

import attempt from 'attempt-x';
import toObject from 'to-object-x';
import toLength from 'to-length-x';
import sameValueZero from 'same-value-zero-x';
import findIndex from 'find-index-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import indexOf from 'index-of-x';
import calcFromIndex from 'calculate-from-index-x';
var nativeIncludes = typeof Array.prototype.includes === 'function' && Array.prototype.includes;
var isWorking;

if (nativeIncludes) {
  var arr;
  var res = attempt.call(null, nativeIncludes, 'a');
  isWorking = res.threw;

  if (isWorking) {
    arr = {
      1: 'a',
      2: NaN,
      3: -0,
      length: 5
    };
    /* eslint-disable-next-line no-void */

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
    var testArr = [];
    testArr.length = 2;
    testArr[1] = null;
    /* eslint-disable-next-line no-void */

    res = attempt.call(testArr, nativeIncludes, void 0);
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    res = attempt.call('abc', nativeIncludes, 'c');
    isWorking = res.threw === false && res.value === true;
  }

  if (isWorking) {
    res = attempt.call(function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    }('a', 'b', 'c'), nativeIncludes, 'c');
    isWorking = res.threw === false && res.value === true;
  }
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
 */


var $includes;

if (isWorking) {
  $includes = function includes(array, searchElement) {
    var args = [searchElement];

    if (arguments.length > 2) {
      /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
      args[1] = arguments[2];
    }

    return nativeIncludes.apply(array, args);
  };
} else {
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
  var findIdxFrom = function findIndexFrom(object, searchElement, fromIndex) {
    var fIdx = fromIndex;
    var length = toLength(object.length);

    while (fIdx < length) {
      if (sameValueZero(object[fIdx], searchElement)) {
        return fIdx;
      }

      fIdx += 1;
    }

    return -1;
  };

  $includes = function includes(array, searchElement) {
    var _this = this;

    var object = toObject(array);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);

    if (length < 1) {
      return -1;
    }

    if (typeof searchElement === 'undefined') {
      /* eslint-disable-next-line prefer-rest-params */
      var fromIndex = calcFromIndex(iterable, arguments[2]);

      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }

      if (fromIndex > 0) {
        return findIdxFrom(iterable, searchElement, fromIndex) > -1;
      }

      return findIndex(iterable, function (element) {
        _newArrowCheck(this, _this);

        return sameValueZero(searchElement, element);
      }.bind(this)) > -1;
    }
    /* eslint-disable-next-line prefer-rest-params */


    return indexOf(iterable, searchElement, arguments[2], 'samevaluezero') > -1;
  };
}

var inc = $includes;
export default inc;

//# sourceMappingURL=array-includes-x.esm.js.map