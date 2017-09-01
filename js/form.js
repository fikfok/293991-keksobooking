'use strict';

// Модуль для работы с формой создания объявления
window.form = (function () {
  var RED_COLOR = 'rgb(255, 0, 0)';
  var BUNGALO_MIN_PRICE_PRE_NIGHT = 0;
  var FLAT_MIN_PRICE_PRE_NIGHT = 1000;
  var HOUSE_MIN_PRICE_PRE_NIGHT = 5000;
  var PALACE_MIN_PRICE_PRE_NIGHT = 10000;
  var newOfferForm = document.querySelector('form.notice__form');
  var offerTitle = newOfferForm.querySelector('input[type="text"][name="title"]');
  var inputAddress = newOfferForm.querySelector('#address');
  var selectApartType = newOfferForm.querySelector('select#type');
  var inputPriceForNight = newOfferForm.querySelector('input#price');
  var selectRoomNumber = newOfferForm.querySelector('select#room_number');
  var selectCapacity = newOfferForm.querySelector('select#capacity');
  var selectTimeIn = newOfferForm.querySelector('select#timein');
  var selectTimeOut = newOfferForm.querySelector('select#timeout');
  var formIsOk = true;
  var tokyoBlock = document.querySelector('.tokyo');
  var tokyoFilterContainer = tokyoBlock.querySelector('.tokyo__filters-container');
  var pinMain = tokyoBlock.querySelector('.pin__main');
  var pinMainSize = {
    width: 74,
    height: 94
  };
  var mapRegion = {
    xMin: 0 - pinMainSize.width / 2,
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
  function inputBlurHandler(event) {
    event.target.removeEventListener('input', inputEnteringHandler);
    event.target.removeEventListener('blur', inputBlurHandler);
  }

  /**
   * Пометка элементов формы, которые оказались не корректны
   * @param {object} element - элемент, который надо пометить, что он некорректен
   */
  var showIncorrectElement = function (element) {
    element.style.borderColor = RED_COLOR;
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

          if (elementsInForm[i].value < getAppartPrice(selectApartType.value) || elementsInForm[i].value > 1000000 || elementsInForm[i].value.length === 0) {
            formIsOk = false;
            showIncorrectElement(elementsInForm[i]);
          }
        }
      }
    }

    if (formIsOk) {
      newOfferForm.submit();
      newOfferForm.reset();
    }
  };

  /**
   * Синхронизация полей формы
   * @param {object} masterElement - первый элемент, который является инициатором
   * @param {object} slaveElement - второй элемент, состояние которого необходимо изменить
   * @param {function} callback - функция сравнения элементов
   */
  var synchronizeFields = function (masterElement, slaveElement, callback) {
    masterElement.addEventListener('change', function () {
      callback(masterElement, slaveElement);
    });
  };

  /**
   * Синхронизация выпадающих списков со временем
   * @param {object} elementTimeIn - список со временем заезда
   * @param {object} elementTimeOut - список со временем выезда
   */
  var timeSinc = function (elementTimeIn, elementTimeOut) {
    elementTimeOut.value = elementTimeIn.value;
  };

  /**
   * Синхронизация цены за ночь на основе типа жилья
   * @param {object} elementApartType - выпадающий список с типом жилья
   * @param {object} elementPrice - числовое поле с ценой за ночь
   */
  var appartPriceSinc = function (elementApartType, elementPrice) {
    elementPrice.value = getAppartPrice(elementApartType.value);
  };

  /**
   * Синхронизация выпадающего списка с количеством гостей на основе количества комнат
   * @param {object} elementRoomsNumber - выпадающий список с количеством комнат
   * @param {object} elementCapacity - выпадающий список с количеством гостей
   */
  var roomNumberCapacitySinc = function (elementRoomsNumber, elementCapacity) {
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
   * @param {object} element - элемент, на котором иммитирую выбор нового значения
   */
  var simulateChangeEventOnSelect = function (element) {
    var evt = new Event('change');
    element.options[0].selected = true;
    element.dispatchEvent(evt);
  };

  /**
   * Обработчик ввода данных в поле адресса
   * @param {object} evt - данные о событии
   */
  var addressEnteringHandler = function (evt) {
    formIsOk = true;
    checkAddress(evt.target);
    evt.target.removeEventListener('input', addressEnteringHandler);
  };

  /**
   * Обработчик потери фокуса с поля адреса
   * @param {object} evt - данные о событии
   */
  var addressBlurHandler = function (evt) {
    formIsOk = true;
    checkAddress(evt.target);
    evt.target.removeEventListener('blur', addressBlurHandler);
  };

  /**
   * Проверка введённого адреса
   * @param {object} address - поле с введённым адресом
   */
  var checkAddress = function (address) {
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
      enteredCoords.x = usersAddress[1];
      enteredCoords.y = usersAddress[2];
      checkedCoords = window.utils.checkPointPosition(mapRegion, enteredCoords);
      if (enteredCoords.x === checkedCoords.x && enteredCoords.y === checkedCoords.y) {
        // Точка попала в область карты. Изменяю положение пин-флажка
        pinMain.style.left = enteredCoords.x - pinMainSize.width / 2 + 'px';
        pinMain.style.top = enteredCoords.y - pinMainSize.height + 'px';
      } else {
        // Точка вне области карты
        formIsOk = false;
        address.style.borderColor = RED_COLOR;
      }
    } else {
      // Введённый формат не верен
      formIsOk = false;
      address.style.borderColor = RED_COLOR;
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

  offerTitle.removeAttribute('minLength');
  offerTitle.removeAttribute('maxLength');
  offerTitle.removeAttribute('required');

  synchronizeFields(selectApartType, inputPriceForNight, appartPriceSinc);
  simulateChangeEventOnSelect(selectApartType);
  synchronizeFields(selectTimeIn, selectTimeOut, timeSinc);
  synchronizeFields(selectTimeOut, selectTimeIn, timeSinc);
  synchronizeFields(selectRoomNumber, selectCapacity, roomNumberCapacitySinc);
  simulateChangeEventOnSelect(selectRoomNumber);

  inputAddress.addEventListener('input', function (evt) {
    if (inputAddress.value.length > 0) {
      addressEnteringHandler(evt);
    }
  });
  inputAddress.addEventListener('blur', addressBlurHandler);
  newOfferForm.addEventListener('submit', submitFormHandler);
})();
