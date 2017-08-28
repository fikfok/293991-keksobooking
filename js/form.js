'use strict';

// Модуль для работы с формой создания объявления
window.form = (function () {
  /**
   * Обработчик невалидной данной формы notice__form
   * @param {object} evt - данные о событии
   */
  var formValidationHandler = function (evt) {
    // Сбрасываю красную рамку у полей, которые в данной итерации корректны, а в предыдущей итерации не были корректны
    var validElementsWithRedBorder = newOfferForm.querySelectorAll('input:valid[style*="border-color: ' + window.data.RED_COLOR + '"]');
    if (validElementsWithRedBorder.length > 0) {
      var elementsNumber = validElementsWithRedBorder.length;
      for (var i = 0; i < elementsNumber; i++) {
        validElementsWithRedBorder[i].style.borderColor = null;
      }
    }
    if (checkRoomNumber() === 'ок') {
      selectRoomNumber.style.borderColor = null;
    }

    // Некорректным полям рисую красную рамку
    var element = evt.target;
    element.style.borderColor = window.data.RED_COLOR;
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
        inputPriceForNight.min = window.data.BUNGALO_MIN_PRICE_PRE_NIGHT;
      } else if (evt.target.value.toString().toLowerCase() === 'flat') {
        inputPriceForNight.min = window.data.FLAT_MIN_PRICE_PRE_NIGHT;
      } else if (evt.target.value.toString().toLowerCase() === 'house') {
        inputPriceForNight.min = window.data.HOUSE_MIN_PRICE_PRE_NIGHT;
      } else if (evt.target.value.toString().toLowerCase() === 'palace') {
        inputPriceForNight.min = window.data.PALACE_MIN_PRICE_PRE_NIGHT;
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
  buttonSubmit.addEventListener('click', submitClickHandler);
})();
