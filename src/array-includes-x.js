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

const ni = [].includes;
const nativeIncludes = typeof ni === 'function' && ni;

const getArrayLike = function getArrayLike() {
  return {
    1: 'a',
    2: NaN,
    3: -0,
    length: 5,
  };
};

const test1 = function test1() {
  return attempt.call(null, nativeIncludes, 'a').threw;
};

const test2 = function test2() {
  const arr = getArrayLike();
  /* eslint-disable-next-line no-void */
  const res = attempt.call(arr, nativeIncludes, void 0, -1);

  return res.threw === false && res.value === true;
};

const test3 = function test3() {
  const arr = getArrayLike();
  const res = attempt.call(arr, nativeIncludes, NaN);

  return res.threw === false && res.value === true;
};

const test4 = function test4() {
  const arr = getArrayLike();
  const res = attempt.call(arr, nativeIncludes, 0);

  return res.threw === false && res.value === true;
};

const test5 = function test5() {
  const testArr = [];
  testArr.length = 2;
  testArr[1] = null;
  /* eslint-disable-next-line no-void */
  const res = attempt.call(testArr, nativeIncludes, void 0);

  return res.threw === false && res.value === true;
};

const test6 = function test6() {
  const res = attempt.call('abc', nativeIncludes, 'c');

  return res.threw === false && res.value === true;
};

const test7 = function test7() {
  const res = attempt.call(
    (function getArgs() {
      /* eslint-disable-next-line prefer-rest-params */
      return arguments;
    })('a', 'b', 'c'),
    nativeIncludes,
    'c',
  );

  return res.threw === false && res.value === true;
};

const isWorking = toBoolean(nativeIncludes) && test1() && test2() && test3() && test4() && test5() && test6() && test7();

const patchedReduce = function includes(array, searchElement) {
  requireObjectCoercible(array);
  const args = [searchElement];

  if (arguments.length > 2) {
    /* eslint-disable-next-line prefer-rest-params,prefer-destructuring */
    args[1] = arguments[2];
  }

  return nativeIncludes.apply(array, args);
};

// eslint-disable jsdoc/check-param-names
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
const findIdxFrom = function findIndexFrom(args) {
  const [object, searchElement, fromIndex] = args;
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

const runFindIndex = function runFindIndex(obj) {
  const {iterable, args, length, searchElement} = obj;
  let fromIndex = calcFromIndex(iterable, args[2]);

  if (fromIndex >= length) {
    return -1;
  }

  if (fromIndex < 0) {
    fromIndex = 0;
  }

  return fromIndex > 0
    ? findIdxFrom([iterable, searchElement, fromIndex]) > -1
    : findIndex(iterable, function predicate(element) {
        return sameValueZero(searchElement, element);
      }) > -1;
};

export const implementation = function includes(array, searchElement) {
  const object = toObject(array);
  const iterable = splitIfBoxedBug(object);
  const length = toLength(iterable.length);

  if (length < 1) {
    return -1;
  }

  if (typeof searchElement === 'undefined') {
    /* eslint-disable-next-line prefer-rest-params */
    return runFindIndex({iterable, args: arguments, length, searchElement});
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
const $includes = isWorking ? patchedReduce : implementation;

export default $includes;
