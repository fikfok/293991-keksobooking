'use strict';

// Модуль для отрисовки объявления в детальном блоке
window.card = (function () {
  var offerDialog = document.querySelector('#offer-dialog');
  var buttonCloseOffer = offerDialog.querySelector('.dialog__close');
  var pinMap = document.querySelector('.tokyo__pin-map');
  var utils = window.utils;

  /**
   * Обработчик события нажатия на крестик закрытия окна оффера. Отслеживается клик мыши и нажатие Esc
   * @param {object} evt - данные о событии
   */
  var closeOffer = function () {
    var activePin = pinMap.querySelector('.pin--active');
    if (!offerDialog.classList.contains('hidden')) {
      offerDialog.classList.add('hidden');
    }
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
  };

  buttonCloseOffer.addEventListener('click', utils.clickHandler(closeOffer));
  window.addEventListener('keydown', utils.escPressHandler(closeOffer));

  return {
    closeOffer: closeOffer
  };
})();
