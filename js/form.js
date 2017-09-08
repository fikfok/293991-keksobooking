'use strict';

// Модуль для работы с формой создания объявления
window.form = (function () {
  var RED_COLOR = 'rgb(255, 0, 0)';
  var BUNGALO_MIN_PRICE_PRE_NIGHT = 0;
  var FLAT_MIN_PRICE_PRE_NIGHT = 1000;
  var HOUSE_MIN_PRICE_PRE_NIGHT = 5000;
  var PALACE_MIN_PRICE_PRE_NIGHT = 10000;
  var newOfferForm = document.querySelector('form.notice__form');
  var formIsOk = true;
  var tokyoBlock = document.querySelector('.tokyo');
  var tokyoFilterContainer = tokyoBlock.querySelector('.tokyo__filters-container');
  var pinMain = tokyoBlock.querySelector('.pin__main');
  var pinMainSize = {
    width: 74,
    height: 94
  };
  var pinMainStartPosition = {
    x: pinMain.offsetLeft,
    y: pinMain.offsetTop
  };

  var mapRegion = {
    xMin: pinMainSize.width / -2,
    xMax: tokyoBlock.getBoundingClientRect().width,
    yMin: 200,
    yMax: tokyoBlock.getBoundingClientRect().height - tokyoFilterContainer.offsetHeight
  };

  /**
   * Обработчик события ввода на элементе
   * @param {object} event - данные о событии
   */
  function inputEnteringHandler(event) {
    if (!formIsOk) {
      formIsOk = true;
      if (event.target.style.borderColor) {
        event.target.style.borderColor = '';
      }
    }
  }

  /**
   * Обработчик события потери фокуса на элементе
   * @param {object} event - данные о событии
   */
  var inputBlurHandler = function (event) {
    event.target.removeEventListener('input', inputEnteringHandler);
    event.target.removeEventListener('blur', inputBlurHandler);
  };

  /**
   * Отметка некорректного поля на форме
   * @param {object} element - элемент, который надо пометить, что он некорректен
   */
  var markIncorrectField = function (element) {
    element.style.borderColor = RED_COLOR;
  };

  /**
   * Пометка элементов формы, которые оказались не корректны
   * @param {object} element - элемент, который надо пометить, что он некорректен
   */
  var showIncorrectElement = function (element) {
    markIncorrectField(element);
    element.addEventListener('input', inputEnteringHandler);
    element.addEventListener('blur', inputBlurHandler);
  };

  /**
   * Обработчик формы
   * @param {object} event - данные о событии
   */
  var submitFormHandler = function (event) {
    event.preventDefault();
    var elementsInForm = newOfferForm.elements;
    var fieldsNumber = elementsInForm.length;

    for (var i = 0; i < fieldsNumber; i++) {
      // Проверка текстовых полей
      if (elementsInForm[i].tagName.toLowerCase() === 'input') {
        elementsInForm[i].style.borderColor = '';
        if (elementsInForm[i].type.toLowerCase() === 'text') {
          if (elementsInForm[i].name.toLowerCase() === 'title') {
            if (elementsInForm[i].value.length < 30 || elementsInForm[i].value.length > 100) {
              formIsOk = false;
              showIncorrectElement(elementsInForm[i]);
            }
          } else if (elementsInForm[i].name.toLowerCase() === 'address') {
            checkAddress(elementsInForm[i]);
          }
        } else if (elementsInForm[i].type.toLowerCase() === 'number') {

          if (elementsInForm[i].value < getAppartPrice(newOfferForm.type.value) || elementsInForm[i].value > 1000000 || elementsInForm[i].value.length === 0) {
            formIsOk = false;
            showIncorrectElement(elementsInForm[i]);
          }
        }
      }
    }

    if (formIsOk) {
      window.backend.save(new FormData(newOfferForm), function () {
        newOfferForm.reset();
        resetFormToDefault();
      },
      window.backend.showRequestError
      );
    }
  };

  /**
   * Синхронизация выпадающих списков со временем
   * @param {object} elementTimeIn - список со временем заезда
   * @param {object} elementTimeOut - список со временем выезда
   */
  var timeSync = function (elementTimeIn, elementTimeOut) {
    elementTimeOut.value = elementTimeIn.value;
  };

  /**
   * Синхронизация цены за ночь на основе типа жилья
   * @param {object} elementApartType - выпадающий список с типом жилья
   * @param {object} elementPrice - числовое поле с ценой за ночь
   */
  var appartPriceSync = function (elementApartType, elementPrice) {
    elementPrice.value = getAppartPrice(elementApartType.value);
  };

  /**
   * Синхронизация адреса в контроле с положением главного пина
   */
  var pinMainAddressSync = function () {
    // Атрибуты pinMain.style.left и pinMain.style.top отличаются от pinMain.offsetLeft и pinMain.offsetTop. Применяю первый вариант,
    // т.к. расчёт границ адаптировано к этим координатам
    newOfferForm.address.value = 'x: ' + Math.floor((parseInt(pinMain.style.left, 10) + pinMainSize.width / 2)) + ', ' + 'y: ' + Math.floor((parseInt(pinMain.style.top, 10) + pinMainSize.height));
  };

  /**
   * Синхронизация выпадающего списка с количеством гостей на основе количества комнат
   * @param {object} elementRoomsNumber - выпадающий список с количеством комнат
   * @param {object} elementCapacity - выпадающий список с количеством гостей
   */
  var roomNumberCapacitySync = function (elementRoomsNumber, elementCapacity) {
    var currentRooms = null;
    var currentCapacity = null;
    var options1 = elementRoomsNumber.options;
    var options2 = elementCapacity.options;
    for (var i = 0; i < options1.length; i++) {
      if (options1[i].selected) {
        currentRooms = +options1[i].value;
      }
    }

    for (i = 0; i < options2.length; i++) {
      currentCapacity = +options2[i].value;
      options2[i].disabled = false;

      if (currentRooms === 100 && currentCapacity === 0) {
        options2[i].selected = true;
      } else if (currentRooms === currentCapacity) {
        options2[i].selected = true;
      } else {
        if (currentCapacity > currentRooms || currentCapacity === 0 || (currentRooms === 100 && currentCapacity !== 0)) {
          options2[i].disabled = true;
        }
      }
    }
  };

  /**
   * Имитация нажатия на типе жилья, чтобы сгенерировать предлагаемую цену за ночь
   * @param {string} eventType - тип события
   * @param {object} element - элемент, на котором иммитирую выбор нового значения
   */
  var simulateChangeEventOnSelect = function (eventType, element) {
    var evt = new Event(eventType);
    element.options[0].selected = true;
    element.dispatchEvent(evt);
  };

  /**
   * Функция проверки и синхронизации введённого адреса и положения главного пина
   * @param {object} address - поле с введённым адресом
   * @param {object} pin - главный пин. Задействуется только при синхронизации. При проверке формы не задаётся и не используется
   */
  var checkAddress = function (address, pin) {
    var enteredCoords = {
      x: null,
      y: null
    };
    var checkedCoords = {
      x: null,
      y: null
    };
    var usersAddress = address.value.match(/^x:\s(\d{1,4}),\sy:\s(\d{1,3})$/i);
    if (usersAddress) {
      // Адрес соответствует формату. Но этого мало, надо проверить попадает ли точка в область карты
      address.style.borderColor = '';
      enteredCoords.x = +usersAddress[1];
      enteredCoords.y = +usersAddress[2];
      checkedCoords = window.utils.checkPointPosition(mapRegion, enteredCoords);
      if (enteredCoords.x === checkedCoords.x && enteredCoords.y === checkedCoords.y) {
        if (pin) {
          // Точка попала в область карты. Изменяю положение пин-флажка
          pinMain.style.left = enteredCoords.x - pinMainSize.width / 2 + 'px';
          pinMain.style.top = enteredCoords.y - pinMainSize.height + 'px';
        }
      } else {
        // Точка вне области карты
        formIsOk = false;
        markIncorrectField(address);
      }
    } else {
      // Введённый формат не верен
      formIsOk = false;
      markIncorrectField(address);
    }
  };

  /**
   * Определение цены за ночь в зависимости от типа жилья
   * @param {string} appartName - название типа жилья
   * @return {number} - стоимость
   */
  var getAppartPrice = function (appartName) {
    var result = null;
    switch (appartName) {
      case 'bungalo':
        result = BUNGALO_MIN_PRICE_PRE_NIGHT;
        break;
      case 'flat':
        result = FLAT_MIN_PRICE_PRE_NIGHT;
        break;
      case 'house':
        result = HOUSE_MIN_PRICE_PRE_NIGHT;
        break;
      case 'palace':
        result = PALACE_MIN_PRICE_PRE_NIGHT;
        break;
    }
    return result;
  };

  /**
   * Проверка цены на ввод: если введено меньше минимума, то оставлять минимум
   * @param {object} event - данные о событии
   */
  var changePriceHandler = function (event) {
    var minPrice = getAppartPrice(newOfferForm.type.value);
    if (event.target.value < minPrice) {
      event.target.value = minPrice;
    }
  };

  /**
   * Сброс формы в первоначальное состояние
   */
  var resetFormToDefault = function () {
    simulateChangeEventOnSelect('change', newOfferForm.type);
    simulateChangeEventOnSelect('change', newOfferForm.rooms);
    simulateChangeEventOnSelect('change', newOfferForm.timein);
    pinMain.style.left = pinMainStartPosition.x + 'px';
    pinMain.style.top = pinMainStartPosition.y + 'px';
    pinMainAddressSync();
  };

  /**
   * Синхронизация всего и сразу
   */
  var initialSync = function () {
    var callbackWithoutParams = false;
    window.synchronizeFields('change', newOfferForm.type, newOfferForm.price, appartPriceSync, callbackWithoutParams);
    window.synchronizeFields('change', newOfferForm.timein, newOfferForm.timeout, timeSync, callbackWithoutParams);
    window.synchronizeFields('change', newOfferForm.timeout, newOfferForm.timein, timeSync, callbackWithoutParams);
    window.synchronizeFields('change', newOfferForm.rooms, newOfferForm.capacity, roomNumberCapacitySync, callbackWithoutParams);
    resetFormToDefault();
    window.synchronizeFields('input', newOfferForm.address, pinMain, checkAddress, callbackWithoutParams);
  };

  newOfferForm.title.removeAttribute('minLength');
  newOfferForm.title.removeAttribute('maxLength');
  newOfferForm.title.removeAttribute('required');

  initialSync();

  newOfferForm.addEventListener('submit', submitFormHandler);
  newOfferForm.price.addEventListener('change', changePriceHandler);
  return {
    pinMainAddressSync: pinMainAddressSync
  };
})();
