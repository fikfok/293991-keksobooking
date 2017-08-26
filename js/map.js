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
 * @param  {boolean} isPinActive - создать данный блок актитвным или нет
 * @return {Element} - div-блок, html узел
 */
var createAnotherDiv = function (singleAd, pin, isPinActive) {
  var newDiv = document.createElement('div');
  newDiv.classList.add('pin');
  if (isPinActive) {
    newDiv.classList.add('pin--active');
  }
  newDiv.style.left = (singleAd.location.x + pin.width / 2) + 'px';
  newDiv.style.top = (singleAd.location.y + pin.height) + 'px';
  newDiv.dataset.id = singleAd.author.avatar + '_' + singleAd.location.x + '_' + singleAd.location.y;
  newDiv.tabIndex = 0;

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
    someFragment.appendChild(createAnotherDiv(someArray[i], pin, i === 0 ? true : false));
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
var collectionOfDivsWithPins = pinMap.querySelectorAll('div[data-id^="img/avatars/user"]');


// Отрисовываю конкретное объявление в детальном виде
showAdInDetailedView(arrayOfAds, 0);
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// События
var clickedPin = null;
var offerDialog = document.getElementById('offer-dialog');

/**
 * Обработчик события нажатия на пин-флажок. Отслеживается клик мыши и нажатие Enter
 * @param {object} evt - данные о событии
 */
var pinClickHandler = function (evt) {
  if (evt.type.toString().toLowerCase() === 'click' || evt.keyCode === 13) {
    clickedPin = (evt.target.tagName.toLowerCase() === 'img') ? evt.target.parentElement : evt.target;

    if (!clickedPin.classList.contains('pin__main')) {
      var childrenNumber = clickedPin.parentElement.children.length;
      for (var i = 0; i < childrenNumber; i++) {
        if (clickedPin.parentElement.children[i].classList.contains('pin--active')) {
          clickedPin.parentElement.children[i].classList.remove('pin--active');
        }
      }
      clickedPin.classList.add('pin--active');
      showAdInDetailedView(arrayOfAds, Array.prototype.indexOf.call(collectionOfDivsWithPins, clickedPin));
      offerDialog.classList.remove('hidden');
    }
  }
};

var buttonCloseOffer = document.querySelector('.dialog__close');
/**
 * Обработчик события нажатия на крестик закрытия окна оффера. Отслеживается клик мыши и нажатие Esc
 * @param {object} evt - данные о событии
 */
var closeOfferClickHandler = function (evt) {
  if (evt.type.toString().toLowerCase() === 'click' || evt.keyCode === 27) {
    offerDialog.classList.add('hidden');
    pinMap.querySelector('.pin--active').classList.remove('pin--active');
  }
};


pinMap.addEventListener('click', pinClickHandler);
pinMap.addEventListener('keydown', pinClickHandler);
buttonCloseOffer.addEventListener('click', closeOfferClickHandler);
window.addEventListener('keydown', closeOfferClickHandler);
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Валидация формы
/**
 * Обработчик невалидной данной формы notice__form
 * @param {object} evt - данные о событии
 */
var formValidationHandler = function (evt) {
  // Сбрасываю красную рамку у полей, которые в данной итерации корректны, а в предыдущей итерации не были корректны
  var validElementsWithRedBorder = newOfferForm.querySelectorAll('input:valid[style*="border-color: rgb(255, 0, 0)"]');
  if (validElementsWithRedBorder.length > 0) {
    var elementsNumber = validElementsWithRedBorder.length;
    for (var i = 0; i < elementsNumber; i++) {
      validElementsWithRedBorder[i].style.borderColor = null;
    }
  }
  if (checkRoomNumber() === 'ок') {
    selectRoomNumber.style.borderColor = null;
  }

  // Рисую некорректным полям красную рамку
  var element = evt.target;
  element.style.borderColor = 'rgb(255, 0, 0)';
};

/**
 * Обработчик выпадающих списков
 * @param {object} evt - данные о событии
 */
var selectChangeHandler = function (evt) {
  if (evt.target.id.toString().toLowerCase() === 'timein') {
    selectTimeOut.value = evt.target.value;
  } else if (evt.target.id.toString().toLowerCase() === 'timeout') {
    selectTimeIn.value = evt.target.value;
  } else if (evt.target.id.toString().toLowerCase() === 'type') {
    if (evt.target.value.toString().toLowerCase() === 'bungalo') {
      inputPriceForNight.min = 0;
    } else if (evt.target.value.toString().toLowerCase() === 'flat') {
      inputPriceForNight.min = 1000;
    } else if (evt.target.value.toString().toLowerCase() === 'house') {
      inputPriceForNight.min = 5000;
    } else if (evt.target.value.toString().toLowerCase() === 'palace') {
      inputPriceForNight.min = 10000;
    }
  }
};

/**
 * Проверка правильности установки количества комнат и гостей
 * @return {string} - результат проверки
 */
var checkRoomNumber = function () {
  var result = '';
  if (selectRoomNumber.value === '1') {
    if (!(selectCapacity.value === '1')) {
      result = '1 комната только для одного гостя';
    } else {
      result = 'ок';
    }
  } else if (selectRoomNumber.value === '2') {
    if (!(selectCapacity.value === '1' || selectCapacity.value === '2')) {
      result = '2 комнат только для 2-х или 1-го гостя';
    } else {
      result = 'ок';
    }
  } else if (selectRoomNumber.value === '3') {
    if (!(selectCapacity.value === '1' || selectCapacity.value === '2' || selectCapacity.value === '3')) {
      result = '3 комнат только для 3-х, 2-х или 1-го гостя';
    } else {
      result = 'ок';
    }
  } else if (selectRoomNumber.value === '100') {
    if (!(selectCapacity.value === '0')) {
      result = '100 комнат не для гостей';
    } else {
      result = 'ок';
    }
  }
  return result;
};

/**
 * Обработчик отправки формы
 */
var submitClickHandler = function () {
  // По заданию сказано проверять именно при отправке
  var checkResult = (checkRoomNumber() === 'ок') ? '' : checkRoomNumber();
  selectRoomNumber.setCustomValidity(checkResult);

  if (newOfferForm.checkValidity()) {
    newOfferForm.submit();
  }
};

var newOfferForm = document.querySelector('form.notice__form');
var selectApartType = newOfferForm.querySelector('select#type');
var inputPriceForNight = newOfferForm.querySelector('input#price');
var selectRoomNumber = newOfferForm.querySelector('select#room_number');
var selectCapacity = newOfferForm.querySelector('select#capacity');
var selectTimeIn = newOfferForm.querySelector('select#timein');
var selectTimeOut = newOfferForm.querySelector('select#timeout');
var buttonSubmit = newOfferForm.querySelector('button.form__submit');

newOfferForm.addEventListener('invalid', formValidationHandler, true);
selectTimeIn.addEventListener('change', selectChangeHandler);
selectTimeOut.addEventListener('change', selectChangeHandler);
selectApartType.addEventListener('change', selectChangeHandler);
// Решил всё-таки привязать функцию именно к нажатию кнопки, т.к. если привязать на событие submit формы и вызвать preventDefault,
// то почему-то некорректно отрабатывает проверка сочетания количества комнат и жильцов: если тестировать на некорректность,
// то независимо от значений высвечивает одно и тоже ссобщение об ошибке '1 комната только для варианта "не для гостей"'
buttonSubmit.addEventListener('click', submitClickHandler);


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
