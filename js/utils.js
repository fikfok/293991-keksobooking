'use strict';

// Модуль, который создает данные
window.utils = (function () {
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

  return {
    getAnyElement: getAnyElement,
    getRandomNumber: getRandomNumber,
    getSubArray: getSubArray,
    getSelfOrParentByClass: getSelfOrParentByClass
  };
})();
