function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import attempt from 'attempt-x';
import toObject from 'to-object-x';
import toLength from 'to-length-x';
import sameValueZero from 'same-value-zero-x';
import findIndex from 'find-index-x';
import splitIfBoxedBug from 'split-if-boxed-bug-x';
import indexOf from 'index-of-x';
import calcFromIndex from 'calculate-from-index-x';
import toBoolean from 'to-boolean-x';
import requireObjectCoercible from 'require-object-coercible-x';
var ni = [].includes;
var nativeIncludes = typeof ni === 'function' && ni;

var getArrayLike = function getArrayLike() {
  return {
    1: 'a',
    2: NaN,
    3: -0,
    length: 5
  };
};

var test1 = function test1() {
  return attempt.call(null, nativeIncludes, 'a').threw;
};

var test2 = function test2() {
  var arr = getArrayLike();
  /* eslint-disable-next-line no-void */

  var res = attempt.call(arr, nativeIncludes, void 0, -1);
  return res.threw === false && res.value === true;
};

var test3 = function test3() {
  var arr = getArrayLike();
  var res = attempt.call(arr, nativeIncludes, NaN);
  return res.threw === false && res.value === true;
};

var test4 = function test4() {
  var arr = getArrayLike();
  var res = attempt.call(arr, nativeIncludes, 0);
  return res.threw === false && res.value === true;
};

var test5 = function test5() {
  var testArr = [];
  testArr.length = 2;
  testArr[1] = null;
  /* eslint-disable-next-line no-void */

  var res = attempt.call(testArr, nativeIncludes, void 0);
  return res.threw === false && res.value === true;
};

var test6 = function test6() {
  var res = attempt.call('abc', nativeIncludes, 'c');
  return res.threw === false && res.value === true;
};

var test7 = function test7() {
  var res = attempt.call(function getArgs() {
    /* eslint-disable-next-line prefer-rest-params */
    return arguments;
  }('a', 'b', 'c'), nativeIncludes, 'c');
  return res.threw === false && res.value === true;
};

var isWorking = toBoolean(nativeIncludes) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

var patchedReduce = function includes(array, searchElement) {
  requireObjectCoercible(array);
  var args = [searchElement];

  if (arguments.length > 2) {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    args[1] = arguments[2];
  }

  return nativeIncludes.apply(array, args);
}; // eslint-disable jsdoc/check-param-names
// noinspection JSCommentMatchesSignature

/**
 * This method returns an index in the array, if an element in the array
 * satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @private
 * @param {Array} object - The array to search.
 * @param {*} searchElement - Element to locate in the array.
 * @param {number} fromIndex - The index to start the search at.
 * @returns {number} Returns index of found element, otherwise -1.
 */
// eslint-enable jsdoc/check-param-names


var findIdxFrom = function findIndexFrom(args) {
  var _args = _slicedToArray(args, 3),
      object = _args[0],
      searchElement = _args[1],
      fromIndex = _args[2];

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

var runFindIndex = function runFindIndex(obj) {
  var iterable = obj.iterable,
      args = obj.args,
      length = obj.length,
      searchElement = obj.searchElement;
  var fromIndex = calcFromIndex(iterable, args[2]);

  if (fromIndex >= length) {
    return -1;
  }

  if (fromIndex < 0) {
    fromIndex = 0;
  }

  return fromIndex > 0 ? findIdxFrom([iterable, searchElement, fromIndex]) > -1 : findIndex(iterable, function predicate(element) {
    return sameValueZero(searchElement, element);
  }) > -1;
};

export var implementation = function includes(array, searchElement) {
  var object = toObject(array);
  var iterable = splitIfBoxedBug(object);
  var length = toLength(iterable.length);

  if (length < 1) {
    return -1;
  }

  if (typeof searchElement === 'undefined') {
    /* eslint-disable-next-line prefer-rest-params */
    return runFindIndex({
      iterable: iterable,
      args: arguments,
      length: length,
      searchElement: searchElement
    });
  }
  /* eslint-disable-next-line prefer-rest-params */


  return indexOf(iterable, searchElement, arguments[2], 'samevaluezero') > -1;
};
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

var $includes = isWorking ? patchedReduce : implementation;
export default $includes;

//# sourceMappingURL=array-includes-x.esm.js.map