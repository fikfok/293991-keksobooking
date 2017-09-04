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

  /**
   * Проверка на попадание точки в заданную область
   * @param {Object} rectangleRegion - область, в которую должна попасть точка
   * @param {Object} pointPosition - координаты точки
   * @return {Object} - результат, если точка находится в области, то результат - координаты самой точки, если не входит, то какая-либо координата приравнивается границе области
   */
  var checkPointPosition = function (rectangleRegion, pointPosition) {
    var x = pointPosition.x;
    var y = pointPosition.y;

    if (pointPosition.x < rectangleRegion.xMin) {
      x = rectangleRegion.xMin;
    } else if (pointPosition.x > rectangleRegion.xMax) {
      x = rectangleRegion.xMax;
    }

    if (pointPosition.y < rectangleRegion.yMin) {
      y = rectangleRegion.yMin;
    } else if (pointPosition.y > rectangleRegion.yMax) {
      y = rectangleRegion.yMax;
    }
    return {x: x, y: y};
  };

  /**
   * Вывод сообщения с ошибкой при отправке/получении ajax запроса
   * @param {string} errorMessage - сообщение с ошибкой
   * @constructor
   */
  var AJAXErrorHandler = function (errorMessage) {
    var errorMessageNode = document.querySelector('.ajax-error-message');
    if (!errorMessageNode) {
      var node = document.createElement('div');
      node.style.cssText = 'z-index: 100; margin-top: 250px; width: 1200px; margin-left: auto;';
      node.style.cssText += 'margin-right: auto; text-align: center; background-color: red;';
      // node.style.cssText += 'animation: cssAnimation 0s ease-in 1s forwards;';
      // node.style.cssText += '@keyframes cssAnimation {to {width:0; height:0; overflow:hidden;}}';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.classList.add('ajax-error-message');

      node.addEventListener('click', addHiddenClass);
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };

  var addHiddenClass = function (evt) {
    evt.target.classList.add('hidden');
    evt.target.removeEventListener('click', addHiddenClass);
  };

  return {
    getAnyElement: getAnyElement,
    getRandomNumber: getRandomNumber,
    getSubArray: getSubArray,
    getSelfOrParentByClass: getSelfOrParentByClass,
    checkPointPosition: checkPointPosition,
    AJAXErrorHandler: AJAXErrorHandler
  };
})();
