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
var getFeaturesArray = function (arrayOfElements) {
  array = [];
  maxNumber = getRandomNumber(arrayOfElements.length, 1);
  for (var i = 0; i < maxNumber; i++) {
    array.push(getAnyElement(arrayOfElements, true, i));
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
 * @param {integer} adNumber - порядковый номер создаваемого объявления. Этот номер используется при выборке Фишера
 * @return {{author: {avatar: *}, offer: {title: *, address: string, price: number, type: *, rooms: number, guests: number, checkin: *, checkout: *, features: Array}, location: {x: number, y: number}, description: string, photos: Array}}
 */
var createAd = function (adNumber) {
  var locationX = getRandomNumber(900, 300);
  var locationY = getRandomNumber(500, 100);
  var roomsNumber = getRandomNumber(5, 1);

  return {
    author: {avatar: getAnyElement(userAvatarPaths, true, adNumber)},
    offer: {
      title: getAnyElement(offerTitles, true, adNumber),
      address: locationX + ', ' + locationY,
      price: getRandomNumber(1000000, 1000),
      type: getAnyElement(flatTypes.en),
      rooms: roomsNumber,
      guests: roomsNumber * getRandomNumber(3, 1),
      checkin: getAnyElement(checkInOutTimes, false, 0),
      checkout: getAnyElement(checkInOutTimes, false, 0),
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
  newDiv.classList.add('pin');
  newDiv.style.left = (singleAd.location.x + pin.width / 2) + 'px';
  newDiv.style.top = (singleAd.location.y + pin.height) + 'px';

  var newPin = document.createElement('img');
  newPin.classList.add('rounded');
  newPin.src = singleAd.author.avatar;
  newPin.width = 40;
  newPin.height = 40;

  newDiv.appendChild(newPin);
  return newDiv;
};

/**
 * На основе шаблона генерирую новый узел с детальным описанием первого объявления
 * @param {Object} singleAd - экземпляр объявления
 * @return {Element} - html узел с детальным описанием объявления
 */
var createNodeWithDetailInfo = function (singleAd) {
  var templateOffer = document.getElementById('lodge-template').content;
  var newElement = templateOffer.cloneNode(true);

  // Заполняю блок данными из объявления
  newElement.querySelector('.lodge__title').textContent = singleAd.offer.title;
  newElement.querySelector('.lodge__address').textContent = singleAd.offer.address;
  newElement.querySelector('.lodge__price').innerHTML = singleAd.offer.price + '&#x20bd;/ночь'; /* Здесь надо применить именно innerHTML, т.к. код символа рубля можно отобразить только так*/
  newElement.querySelector('.lodge__type').textContent = getRusLodgeType(singleAd.offer.type);
  newElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + singleAd.offer.guests + ' гостей в ' + singleAd.offer.rooms + ' комнатах';
  newElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + singleAd.offer.checkin + ', выезд до ' + singleAd.offer.checkout;
  newElement.querySelector('.lodge__description').textContent = singleAd.description;

  // В цикле генерирую span-элементы обозначающие доп. опции жилища
  var featuresNumber = singleAd.offer.features.length;
  for (var i = 0; i < featuresNumber; i++) {
    var newSpan = document.createElement('span');
    newSpan.classList.add('feature__image');
    newSpan.classList.add('feature__image--' + singleAd.offer.features[i]);
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
  for (var i = 0; i < elementsNumberInArray; i++) {
    someArray.push(createAd(i));
  }
  return someArray;
};

/**
 * Генерирую html-фрагмент, в котором будут отрисовываться пин-флажки и аватарки
 * @param {object} someArray - массив объявлений
 * @param {object} pin - размеры пин-флажка
 */
var generateAndShowFragmentOfAds = function (someArray, pin) {
  var someFragment = document.createDocumentFragment();
  var arrayLength = someArray.length;
  for (var i = 0; i < arrayLength; i++) {
    someFragment.appendChild(createAnotherDiv(someArray[i], pin));
  }
  // Отрисовываю сгенерированные объявления на карте
  pinMap.appendChild(someFragment);
};

/**
 * Отрисовываю конкретное объявление в детальном виде
 * @param {object} someArray - массив объявлений
 * @param {integer} numberOfCurrentAd - номер объявления, которое надо отрисовать в детальном виде
 */
var showAdInDetailedView = function (someArray, numberOfCurrentAd) {
  var oldDialogPanel = document.querySelector('.dialog__panel');
  oldDialogPanel.parentElement.replaceChild(createNodeWithDetailInfo(someArray[numberOfCurrentAd]), oldDialogPanel);

  // Меняю аватар в блоке с детальным описанием объявления
  document.getElementById('offer-dialog').querySelector('.dialog__title').querySelector('img').setAttribute('src', someArray[numberOfCurrentAd].author.avatar);
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

var userAvatarPaths = generateAvatarImgPath(8);

var offerTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var flatTypes = {
  en: ['flat', 'house', 'bungalo'],
  rus: ['Квартира', 'Дом', 'Бунгало']
};

var checkInOutTimes = ['12:00', '13:00', '14:00'];

var additionalFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var adsNumber = 8;
var pinMap = document.querySelector('.tokyo__pin-map');

// Генерация массива объявляений
var arrayOfAds = createArrayOfAds(adsNumber);

// Генерирую и отрисовываю html-фрагмент на основе массива объявлений
generateAndShowFragmentOfAds(arrayOfAds, pinSize);

// Отрисовываю конкретное объявление в детальном виде
showAdInDetailedView(arrayOfAds, 0);
