'use strict';

// Модуль, который создает данные
window.utils = (function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout = null;
  /**
   * Возвращает или сам переданный элемент или его первого родителя, у которого есть переданный класс
   * @param {Object} element - элемент, с которого начинается поиск родителя
   * @param {string} className - название класса, которое ищется или у самого элемента и у его родителей
   * @return {*} - или null, в случае если элемент не найден, или элемент, у которого встретился переданный класс
   */
  var getSelfOrParentByClass = function (element, className) {
    do {
      if (element && element.classList.contains(className)) {
        return element;
      }
      element = element.parentElement;
    } while (element);
    return null;
  };

  /**
   * Проверка на попадание точки в заданную область
   * @param {Object} rectangleRegion - область, в которую должна попасть точка
   * @param {Object} pointPosition - координаты точки
   * @return {Object} - результат, если точка находится в области, то результат - координаты самой точки, если не входит, то какая-либо координата приравнивается границе области
   */
  var checkPointPosition = function (rectangleRegion, pointPosition) {
    var x = pointPosition.x;
    var y = pointPosition.y;
    if (pointPosition.x <= rectangleRegion.xMin) {
      x = rectangleRegion.xMin;
    } else if (pointPosition.x >= rectangleRegion.xMax) {
      x = rectangleRegion.xMax;
    }

    if (pointPosition.y <= rectangleRegion.yMin) {
      y = rectangleRegion.yMin;
    } else if (pointPosition.y >= rectangleRegion.yMax) {
      y = rectangleRegion.yMax;
    }
    return {x: x, y: y};
  };

  /**
   * Обработчик события клика
   * @param {function} callback - callback-функция
   * @return {*} - iife функция, запускающая callback функцию
   */
  var clickHandler = function (callback) {
    if (!checkCallback(callback)) {
      return false;
    }
    return function (evt) {
      callback(evt);
    };
  };

  /**
   * Обработчик события нажатия Enter
   * @param {function} callback - callback-функция
   * @return {*} - iife функция, запускающая callback функцию
   */
  var enterPressHandler = function (callback) {
    if (!checkCallback(callback)) {
      return false;
    }
    return function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        callback(evt);
      }
    };
  };

  /**
   * Обработчик события нажатия Esc
   * @param {function} callback - callback-функция
   * @return {*} - iife функция, запускающая callback функцию
   */
  var escPressHandler = function (callback) {
    if (!checkCallback(callback)) {
      return false;
    }
    return function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        callback(evt);
      }
    };
  };

  /**
   * Проверка callback на тип: функция или нет
   * @param {function} callback - функция, которую надо проверить
   * @return {boolean} - результат: true - функция, иначе false
   */
  var checkCallback = function (callback) {
    var res = false;
    if (typeof callback !== 'function') {
      throw new Error(callback + ' не функция');
    } else {
      res = true;
    }
    return res;
  };

  /**
   * Функция реализующая задержку для устранения частого нажатия: невыполняет предыдущий вызов функции, если
   * с предыдущего до повторного вызова прошло менее DEBOUNCE_INTERVAL мс.
   * @param {function} callback - функция, которую надо выполнить
   */
  var debounce = function (callback) {
    if (checkCallback(callback)) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
    }
  };

  return {
    getSelfOrParentByClass: getSelfOrParentByClass,
    checkPointPosition: checkPointPosition,
    clickHandler: clickHandler,
    enterPressHandler: enterPressHandler,
    escPressHandler: escPressHandler,
    checkCallback: checkCallback,
    debounce: debounce
  };
})();
