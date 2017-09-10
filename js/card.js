'use strict';

// Модуль для отрисовки объявления в детальном блоке
window.card = (function () {
  var offerDialog = document.querySelector('#offer-dialog');
  var buttonCloseOffer = offerDialog.querySelector('.dialog__close');
  var pinMap = document.querySelector('.tokyo__pin-map');

  /**
   * Обработчик события нажатия на крестик закрытия окна оффера. Отслеживается клик мыши и нажатие Esc
   * @param {object} evt - данные о событии
   */
  var closeOffer = function () {
    if (!offerDialog.classList.contains('hidden')) {
      offerDialog.classList.add('hidden');
    }
    var activePin = pinMap.querySelector('.pin--active');
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
  };

  buttonCloseOffer.addEventListener('click', window.utils.clickHandler(closeOffer));
  window.addEventListener('keydown', window.utils.escPressHandler(closeOffer));

  return {
    closeOffer: closeOffer
  };
})();
