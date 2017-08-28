'use strict';

// Модуль для отрисовки пина и взаимодействия с ним
window.pin = (function () {
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
   * Генерирую html-фрагмент, в котором будут отрисовываться пин-флажки и аватарки
   * @param {object} someArray - массив объявлений
   * @param {object} pin - размеры пин-флажка
   */
  var generateAndShowPinsOfAds = function (someArray, pin) {
    var someFragment = document.createDocumentFragment();
    var arrayLength = someArray.length;
    for (var i = 0; i < arrayLength; i++) {
      someFragment.appendChild(createAnotherDiv(someArray[i], pin, i === 0 ? true : false));
    }
    // Отрисовываю сгенерированные объявления на карте
    window.data.pinMap.appendChild(someFragment);
    collectionOfPins = window.data.pinMap.querySelectorAll('div[data-id^="img/avatars/user"]');
  };

  /**
   * Обработчик события нажатия на пин-флажок. Отслеживается клик мыши и нажатие Enter
   * @param {object} evt - данные о событии
   */
  var pinClickHandler = function (evt) {
    clickedPin = (evt.target.tagName.toLowerCase() === 'img') ? evt.target.parentElement : evt.target;

    if (!clickedPin.classList.contains('pin__main')) {
      var childrenNumber = clickedPin.parentElement.children.length;
      for (var i = 0; i < childrenNumber; i++) {
        if (clickedPin.parentElement.children[i].classList.contains('pin--active')) {
          clickedPin.parentElement.children[i].classList.remove('pin--active');
        }
      }
      clickedPin.classList.add('pin--active');
      window.card.showAdInDetailView(window.data.arrayOfAds, Array.prototype.indexOf.call(collectionOfPins, clickedPin));
      window.card.offerDialog.classList.remove('hidden');
      window.addEventListener('keydown', window.card.closeOfferClickHandlerEscPress);
    }
  };

  window.data.pinMap.addEventListener('click', pinClickHandler);
  window.data.pinMap.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      pinClickHandler(evt);
    }
  });

  var clickedPin = null;
  var collectionOfPins = null;

  return {
    generateAndShowPinsOfAds: generateAndShowPinsOfAds
  };
})();
