'use strict';

// Модуль, который создает данные
window.utils = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;


  /**
   * Возвращение случайного элемента из переданного массива. Применяется перестановка Фишера
   * @param {Object} arrayOfElements - массив, из которого будет возвращён случайный элемент
   * @param {boolean} isUnique - признак: использовать перестановку Фишера или нет
   * @param {integer} startIndex - стартовый элемент массива, с которого будет осуществляться случайный выбор. Используется дл перестановки Фишера
   * @return {*}
   */
  var getAnyElement = function (arrayOfElements, isUnique, startIndex) {
    var elementPosition = getRandomNumber(arrayOfElements.length - 1, startIndex);
    var element = arrayOfElements[elementPosition];
    if (isUnique) {
      var tmp = arrayOfElements[startIndex];
      arrayOfElements[startIndex] = element;
      arrayOfElements[elementPosition] = tmp;
    }
    return element;
  };

  /**
   * Возвращает случайное число из диапазона
   * @param {integer} max - максимальная граница
   * @param {integer} min - минимальная граница
   * @return {number} - случайное число
   */
  var getRandomNumber = function (max, min) {
    return Math.round(Math.random() * (max - min) + min);
  };

  /**
  * Возвращает массив случаной длины, содержащий доп. опции
  * @param {Object} arrayOfElements - полный массив доп. опций
  * @return {Array}
  */
  var getSubArray = function (arrayOfElements) {
    var array = [];
    var maxNumber = getRandomNumber(arrayOfElements.length, 1);
    for (var i = 0; i < maxNumber; i++) {
      array.push(getAnyElement(arrayOfElements, true, i));
    }
    return array;
  };

  return {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,

    getAnyElement: getAnyElement,
    getRandomNumber: getRandomNumber,
    getSubArray: getSubArray
  };
})();
