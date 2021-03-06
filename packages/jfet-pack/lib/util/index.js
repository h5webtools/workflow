/**
 * util
 */

const fse = require('fs-extra');

const toStr = Object.prototype.toString;

/**
 * 获取数据类型
 * @param {*} variable 
 * @return {String}
 */
function getType(variable) {
  return toStr.call(variable).replace(/\[object\s+(\w*)\]/, (m, $1) => $1);
}

/**
 * 是否对象
 * @param {Object} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return toStr.call(obj) === '[object Object]';
}

/**
 * 处理路径
 * @param {String[]} files 
 * @param {Function} resolveFn 
 */
function resolvePath(files, resolveFn) {
  if (Array.isArray(files)) {
    return files.map(f => resolveFn(f));
  }

  return files;
}

/**
 * try require
 * @param {String} file 
 */
function tryRequire(file) {
  try {
    return require(file);
  } catch (e) {
    return null;
  }
}

/**
 * 数组去重
 * @param {Array} arr 
 * @return {Array}
 */
function uniqueArray(arr) {
  const ret = [];
  const len = arr.length;
  const tmp = {};

  for (let i = 0; i < len; i++) {
    const curr = arr[i];

    if (!tmp[curr]) {
      tmp[curr] = 1;
      ret.push(curr);
    }
  }

  return ret;
}

/**
 * 判断文件是否存在
 * @param {String} filePath 文件路径
 * @return {Boolean}
 */
function fileExists(filePath) {
  try {
    return fse.statSync(filePath).isFile();
  } catch (e) {
    return false;
  }
}

/**
 * 获取文件大小，byte
 * @param {String} filePath 文件路径
 * @return {Number}
 */
function getFileSize(filePath) {
  try {
    return fse.statSync(filePath).size;
  } catch (e) {
    return 0;
  }
}

module.exports = {
  isObject,
  getType,
  resolvePath,
  uniqueArray,
  tryRequire,
  fileExists,
  getFileSize
};
