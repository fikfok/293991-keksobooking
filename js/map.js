'use strict';

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Функции
/**
 * Генерация массива путей к аватарам
 * @param {integer} numberOfElements - количество элементов в массиве
 * @return {Array}
 */
var generateAvatarImgPath = function (numberOfElements) {
  var array = [];
  for (var i = 1; i <= numberOfElements; i++) {
    array.push('img/avatars/user' + (i < 10 ? '0' : '') + i + '.png');
  }
  return array;
};

/**
 * Возвращение случайного элемента из переданного массива. Применяется перестановка Фишера
 * @param {Object} arrayOfElements - массив, из которого будет возвращён случайный элемент
 * @return {*}
 */
var getAnyElementFisher = function (arrayOfElements) {
  var elementPosition = Math.round(Math.random() * ((arrayOfElements.values.length - 1) - arrayOfElements.counter) + arrayOfElements.counter);
  var element = arrayOfElements.values[elementPosition];
  arrayOfElements.values[elementPosition] = arrayOfElements.values.splice(arrayOfElements.counter, 1, arrayOfElements.values[elementPosition])[0];
  arrayOfElements.counter++;
  return element;
};

/**
 * Возвращает случайный элемент из переданного массива
 * @param {Object} arrayOfElements - массив
 * @return {*}
 */
var getAnyElement = function (arrayOfElements) {
  return arrayOfElements[Math.round(Math.random() * (arrayOfElements.length - 1))];
};

/**
 * Возвращает случайное число из диапазона
 * @param {integer} max - максимальная граница
 * @param {integer} min - минимальная граница
 * @return {number}
 */
var getRandomNumber = function (max, min) {
  return Math.round(Math.random() * (max - min) + min);
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Переменные
function Ads() {
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Локальные переменные, относящиеся к обявлению
  var userAvatarPaths = {
    values: generateAvatarImgPath(8),
    counter: 0
  };

  var offerTitles = {
    values: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    counter: 0
  };

  var flatTypes = ['flat', 'house', 'bungalo'];

  var checkInOutTimes = ['12:00', '13:00', '14:00'];

  var additionalFeatures = {
    values: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    counter: 0
  };
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Интерфейс объекта. Свойства
  this.author = getAnyElementFisher(userAvatarPaths);
  this.location = {x: getRandomNumber(900, 300), y: getRandomNumber(100, 500)};
  this.offer = {
    title: getAnyElementFisher(offerTitles),
    address: this.location.x + ', ' + this.location.y,
    price: getRandomNumber(1000000, 1000),
    type: getAnyElement(flatTypes),
    rooms: getRandomNumber(5, 1),
    checkin: getAnyElement(checkInOutTimes),
    checkout: getAnyElement(checkInOutTimes),
    features: getFeaturesArray(additionalFeatures)
  };
  this.offer.guests = this.offer.rooms * getRandomNumber(3, 1);
  this.description = '';
  this.photos = [];

  /**
   * Возвращает массив случайно длины, содержащий доп. опции
   * @param {Object} arrayOfElements - полный массив доп. опций
   * @return {Array}
   */
  function getFeaturesArray(arrayOfElements) {
    var array = [];
    var maxNumber = getRandomNumber(arrayOfElements.values.length, 1);
    for (var i = 0; i < maxNumber; i++) {
      array.push(getAnyElementFisher(arrayOfElements));
    }
    return array;
  }
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var ads = new Ads();


