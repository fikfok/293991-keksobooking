'use strict';

// Модуль для отрисовки объявления в детальном блоке
window.card = (function () {
  var offerDialog = document.getElementById('offer-dialog');
  var buttonCloseOffer = offerDialog.querySelector('.dialog__close');
  var pinMap = document.querySelector('.tokyo__pin-map');

  /**
   * Обработчик события нажатия на крестик закрытия окна оффера. Отслеживается клик мыши и нажатие Esc
   * @param {object} evt - данные о событии
   */
  var closeOffer = function () {
    offerDialog.classList.add('hidden');
    pinMap.querySelector('.pin--active').classList.remove('pin--active');
    buttonCloseOffer.removeEventListener('click', window.utils.clickHandler(closeOffer));
    window.removeEventListener('keydown', window.utils.escPressHandler(closeOffer));
  };

  buttonCloseOffer.addEventListener('click', window.utils.clickHandler(closeOffer));
  window.addEventListener('keydown', window.utils.escPressHandler(closeOffer));

  return {
    closeOffer: closeOffer
  };
})();
