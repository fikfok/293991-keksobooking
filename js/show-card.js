'use strict';

// Модуль для отрисовки объявления в детальном блоке
window.showCard = (function () {
  var templateOffer = document.querySelector('#lodge-template').content;

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
    singleAd.offer.features.forEach(function (item) {
      var newSpan = document.createElement('span');
      newSpan.classList.add('feature__image');
      newSpan.classList.add('feature__image--' + item);
      newElement.querySelector('.lodge__features').appendChild(newSpan);
    });
    return newElement;
  };

  /**
   * Изменяю аватар в окне с детальным описанием объявления
   * @param {object} offerDialog - диалоговая панель, в которую будут записываться детальные данные
   * @param {string} avatarPath - путь к аватару
   */
  var changeAvatarInDialog = function (offerDialog, avatarPath) {
    var offerDialogAvatar = offerDialog.querySelector('.dialog__title img');
    offerDialogAvatar.src = avatarPath;
  };

  /**
   * Отрисовываю конкретное объявление в детальном виде
   * @param {object} someArray - массив объявлений
   * @param {integer} numberOfCurrentAd - номер объявления, которое надо отрисовать в детальном виде
   * @param {object} offerDialog - диалоговая панель, в которую будут записываться детальные данные
   */
  window.showDetailOffer = function (someArray, numberOfCurrentAd, offerDialog) {
    var detailViewPanel = offerDialog.querySelector('.dialog__panel');

    detailViewPanel.parentElement.replaceChild(createNodeWithDetailInfo(someArray[numberOfCurrentAd]), detailViewPanel);
    changeAvatarInDialog(offerDialog, someArray[numberOfCurrentAd].author.avatar);
  };
})();
