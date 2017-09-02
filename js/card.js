'use strict';

// Модуль для отрисовки объявления в детальном блоке
window.card = (function () {
  var offerDialog = document.getElementById('offer-dialog');
  var buttonCloseOffer = offerDialog.querySelector('.dialog__close');
  var pinMap = document.querySelector('.tokyo__pin-map');
  var ESC_KEYCODE = 27;

  /**
   * Обработчик события нажатия на крестик закрытия окна оффера. Отслеживается клик мыши и нажатие Esc
   * @param {object} evt - данные о событии
   */
  var closeOfferClickHandler = function () {
    offerDialog.classList.add('hidden');
    pinMap.querySelector('.pin--active').classList.remove('pin--active');
    window.removeEventListener('keydown', closeOfferClickHandlerEscPress);
  };

  /**
   * Обработчик события нажатия Esc
   * @param {object} evt - данные о событии
   */
  var closeOfferClickHandlerEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeOfferClickHandler();
    }
  };

  buttonCloseOffer.addEventListener('click', closeOfferClickHandler);
  window.addEventListener('keydown', closeOfferClickHandlerEscPress);

  return {
    closeOfferClickHandlerEscPress: closeOfferClickHandlerEscPress
  };
})();
