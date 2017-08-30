'use strict';

// Модуль для отрисовки объявления в детальном блоке
window.card = (function () {
  /**
   * На основе шаблона генерирую новый узел с детальным описанием первого объявления
   * @param {Object} singleAd - экземпляр объявления
   * @return {Element} - html узел с детальным описанием объявления
   */
  var createNodeWithDetailInfo = function (singleAd) {
    var newElement = templateOffer.cloneNode(true);
    var rusLodgeType = null;
    switch (singleAd.offer.type) {
      case 'flat':
        rusLodgeType = 'Квартира';
        break;
      case 'bungalo':
        rusLodgeType = 'Бунгало';
        break;
      case 'house':
        rusLodgeType = 'Дом';
        break;
    }
    // Заполняю блок данными из объявления
    newElement.querySelector('.lodge__title').textContent = singleAd.offer.title;
    newElement.querySelector('.lodge__address').textContent = singleAd.offer.address;
    newElement.querySelector('.lodge__price').innerHTML = singleAd.offer.price + '&#x20bd;/ночь'; /* Здесь надо применить именно innerHTML, т.к. код символа рубля можно отобразить только так*/
    newElement.querySelector('.lodge__type').textContent = rusLodgeType;
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
   * Отрисовываю конкретное объявление в детальном виде
   * @param {object} someArray - массив объявлений
   * @param {integer} numberOfCurrentAd - номер объявления, которое надо отрисовать в детальном виде
   */
  var showAdInDetailView = function (someArray, numberOfCurrentAd) {
    var oldDialogPanel = offerDialog.querySelector('.dialog__panel');
    oldDialogPanel.parentElement.replaceChild(createNodeWithDetailInfo(someArray[numberOfCurrentAd]), oldDialogPanel);

    // Меняю аватар в блоке с детальным описанием объявления
    offerDialogAvatar.src = someArray[numberOfCurrentAd].author.avatar;
  };

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
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      closeOfferClickHandler();
    }
  };

  var offerDialog = document.getElementById('offer-dialog');
  var buttonCloseOffer = offerDialog.querySelector('.dialog__close');
  var offerDialogAvatar = offerDialog.querySelector('.dialog__title').querySelector('img');
  var pinMap = document.querySelector('.tokyo__pin-map');
  var templateOffer = document.getElementById('lodge-template').content;

  buttonCloseOffer.addEventListener('click', closeOfferClickHandler);

  window.addEventListener('keydown', closeOfferClickHandlerEscPress);
  return {
    showAdInDetailView: showAdInDetailView,
    closeOfferClickHandlerEscPress: closeOfferClickHandlerEscPress
  };
})();
