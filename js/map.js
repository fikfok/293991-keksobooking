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
 * @param {Object} objectOfElements - массив, из которого будет возвращён случайный элемент
 * @return {*}
 */
var getAnyElementFisher = function (objectOfElements) {
  if (objectOfElements.counter === objectOfElements.values.length) {
    objectOfElements.counter = 0;
  }
  var elementPosition = getRandomNumber(objectOfElements.values.length - 1, objectOfElements.counter);
  var element = objectOfElements.values[elementPosition];
  objectOfElements.values[elementPosition] = objectOfElements.values.splice(objectOfElements.counter, 1, objectOfElements.values[elementPosition])[0];
  objectOfElements.counter++;
  return element;
};

/**
 * Возвращает случайный элемент из переданного массива
 * @param {Object} arrayOfElements - массив
 * @return {*}
 */
var getAnyElement = function (arrayOfElements) {
  return arrayOfElements[getRandomNumber(arrayOfElements.length - 1, 0)];
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

/**
* Возвращает массив случаной длины, содержащий доп. опции
* @param {Object} arrayOfElements - полный массив доп. опций
* @return {Array}
*/
var getFeaturesArray = function (arrayOfElements) {
  array = [];
  maxNumber = getRandomNumber(arrayOfElements.values.length, 1);
  for (var i = 0; i < maxNumber; i++) {
    array.push(getAnyElementFisher(arrayOfElements));
  }
  return array;
};

/**
 * Возвращает кириллическое название типа помещения
 * @param {string} offerTypeEn - англоязычное названия типа помещения
 * @return {*}
 */
var getRusLodgeType = function (offerTypeEn) {
  return flatTypes.rus[flatTypes.en.indexOf(offerTypeEn)];
};

/**
 * Возвращает объект-объявление
 * @return {{author: {avatar: *}, offer: {title: *, address: string, price: number, type: *, rooms: number, guests: number, checkin: *, checkout: *, features: Array}, location: {x: number, y: number}, description: string, photos: Array}}
 */
var createAd = function () {
  var locationX = getRandomNumber(900, 300);
  var locationY = getRandomNumber(500, 100);
  var roomsNumber = getRandomNumber(5, 1);

  return {
    author: {avatar: getAnyElementFisher(userAvatarPaths)},
    offer: {
      title: getAnyElementFisher(offerTitles),
      address: locationX + ', ' + locationY,
      price: getRandomNumber(1000000, 1000),
      type: getAnyElement(flatTypes.en),
      rooms: roomsNumber,
      guests: roomsNumber * getRandomNumber(3, 1),
      checkin: getAnyElement(checkInOutTimes),
      checkout: getAnyElement(checkInOutTimes),
      features: getFeaturesArray(additionalFeatures)
    },
    location: {x: locationX, y: locationY},
    description: '',
    photos: []
  };
};

/**
 * Создание div-блока для нового флажка
 * @param {Object} singleAd - экземпляр объявления
 * @param  {Object} pin - размеры пин-флажка
 * @return {Element} - div-блок, html узел
 */
var createAnotherDiv = function (singleAd, pin) {
  var newDiv = document.createElement('div');
  newDiv.className = 'pin';
  newDiv.setAttribute('style', 'left: ' + (singleAd.location.x + pin.width / 2) + 'px; top: ' + (singleAd.location.y + pin.height) + 'px');
  newDiv.appendChild(createAnotherPin(singleAd));
  return newDiv;
};

/**
 * Создание pin-флажка в div-блоке
 * @param {Object} singleAd - экземпляр объявления
 * @return {Element} - флажок-пин, html узел
 */
var createAnotherPin = function (singleAd) {
  var newPin = document.createElement('img');
  newPin.className = 'rounded';
  newPin.setAttribute('src', singleAd.author.avatar);
  newPin.setAttribute('width', '40');
  newPin.setAttribute('height', '40');
  return newPin;
};

/**
 * На основе шаблона генерирую новый узел с детальным описанием первого объявления
 * @param {Object} singleAd - экземпляр объявления
 * @return {Element} - html узел с детальным описанием объявления
 */
var createNodeWithDetailInfo = function (singleAd) {
  var newElement = templateOffer.cloneNode(true);

  // Заполняю блок данными из объявления
  newElement.querySelector('.lodge__title').textContent = singleAd.offer.title;
  newElement.querySelector('.lodge__address').textContent = singleAd.offer.address;
  newElement.querySelector('.lodge__price').innerHTML = singleAd.offer.price + '&#x20bd;/ночь';
  newElement.querySelector('.lodge__type').textContent = getRusLodgeType(singleAd.offer.type);
  newElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + singleAd.offer.guests + ' гостей в ' + singleAd.offer.rooms + ' комнатах';
  newElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + singleAd.offer.checkin + ', выезд до ' + singleAd.offer.checkout;
  newElement.querySelector('.lodge__description').textContent = singleAd.description;

  // В цикле генерирую span-элементы обозначающие доп. опции жилища
  var featuresNumber = singleAd.offer.features.length;
  for (var j = 0; j < featuresNumber; j++) {
    var newSpan = document.createElement('span');
    newSpan.className = 'feature__image feature__image--' + singleAd.offer.features[j];
    newElement.querySelector('.lodge__features').appendChild(newSpan);
  }
  return newElement;
};

/**
 *
 * @param {integer} elementsNumberInArray - количество элементов в создаваемом массиве
 * @return {Array} - массив сгенерированных элементов
 */
var createArrayOfAds = function (elementsNumberInArray) {
  var someArray = [];
  for (i = 0; i < elementsNumberInArray; i++) {
    someArray.push(createAd());
  }
  return someArray;
};

/**
 * Генерирую html-фрагмент, в котором будут отрисовываться пин-флажки и аватарки
 * @param {object} someArray - массив объявлений
 * @param {object} pin - размеры пин-флажка
 * @return {DocumentFragment} - html-фрагмент
 */
var generateFragmentOfAds = function (someArray, pin) {
  var someFragment = document.createDocumentFragment();
  var arrayLength = someArray.length;
  for (i = 0; i < arrayLength; i++) {
    someFragment.appendChild(createAnotherDiv(someArray[i], pin));
  }
  return someFragment;
};

/**
 * Отрисовываю конкретное объявление в детальном виде
 * @param {object} someArray - массив объявлений
 * @param {integer} numberOfCurrentAd - номер объявления, которое надо отрисовать в детальном виде
 */
var showAdInDetailedView = function (someArray, numberOfCurrentAd) {
  var oldDialogPanel = document.querySelector('.dialog__panel');
  oldDialogPanel.parentNode.replaceChild(createNodeWithDetailInfo(someArray[numberOfCurrentAd]), oldDialogPanel);

  // Меняю аватар в блоке с детальным описанием объявления
  document.getElementById('offer-dialog').querySelector('.dialog__title').querySelector('img').setAttribute('src', someArray[numberOfCurrentAd].author.avatar);
};

/**
 * Добавление фрагмента на карту
 * @param {object} someFragment - фрагмент
 */
var showAllAdsOnMap = function (someFragment) {
  var pinMap = document.querySelector('.tokyo__pin-map');
  pinMap.appendChild(someFragment);
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Переменные
var pinSize = {
  width: 56,
  height: 75
};

var array = [];
var maxNumber = 0;

var userAvatarPaths = {
  values: generateAvatarImgPath(8),
  counter: 0
};

var offerTitles = {
  values: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  counter: 0
};

var flatTypes = {
  en: ['flat', 'house', 'bungalo'],
  rus: ['Квартира', 'Дом', 'Бунгало']
};

var checkInOutTimes = ['12:00', '13:00', '14:00'];

var additionalFeatures = {
  values: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  counter: 0
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var i = 0;

var templateOffer = document.getElementById('lodge-template').content;
var adsNumber = 8;

// Генерация массива объявляений
var arrayOfAds = createArrayOfAds(adsNumber);

// Генерирую html-фрагмент на основе массива объявлений
var fragment = generateFragmentOfAds(arrayOfAds, pinSize);

// Отрисовываю сгенерированные объявления на карте
showAllAdsOnMap(fragment);

// Отрисовываю конкретное объявление в детальном виде
showAdInDetailedView(arrayOfAds, 0);
