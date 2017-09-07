'use strict';

// Модуль для отрисовки пина и взаимодействия с ним
window.pin = (function () {
  var tokyoBlock = document.querySelector('.tokyo');
  var offerDialog = tokyoBlock.querySelector('#offer-dialog');
  var pinMap = tokyoBlock.querySelector('.tokyo__pin-map');
  var clickedPin = null;
  var collectionOfPins = null;
  var pinSize = {
    width: 56,
    height: 75
  };

  /**
   * Создание div-блока для нового флажка
   * @param {Object} singleAd - экземпляр объявления
   * @param  {boolean} isPinActive - создать данный блок актитвным или нет
   * @return {Element} - div-блок, html узел
   */
  var createAnotherDiv = function (singleAd, isPinActive) {
    var newDiv = document.createElement('div');
    newDiv.classList.add('pin');
    if (isPinActive) {
      newDiv.classList.add('pin--active');
    }
    newDiv.style.left = (singleAd.location.x - pinSize.width / 2) + 'px';
    newDiv.style.top = (singleAd.location.y - pinSize.height) + 'px';
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
  var showPins = function (someArray) {
    var someFragment = document.createDocumentFragment();
    var arrayLength = someArray.length;
    var isPinActive = false;
    for (var i = 0; i < arrayLength; i++) {
      isPinActive = (i === 0);
      someFragment.appendChild(createAnotherDiv(someArray[i], isPinActive));
    }
    // Отрисовываю сгенерированные объявления на карте
    pinMap.appendChild(someFragment);
    collectionOfPins = pinMap.querySelectorAll('div[data-id^="img/avatars/"]');
  };

  /**
   * Обработчик события нажатия на пин-флажок. Отслеживается клик мыши и нажатие Enter
   * @param {object} evt - данные о событии
   */
  var activatePin = function (evt) {
    clickedPin = window.utils.getSelfOrParentByClass(evt.target, 'pin');
    // Наличие в if'е clickedPin необходимо на тот случай, если pin__main подвести под обычный pin и отпустить,
    // то target'ом будет сама карта и при отработки этой функции
    // возникнет ошибка и неправильное присвоение класса pin--active
    if (clickedPin && !clickedPin.classList.contains('pin__main')) {
      var childrenNumber = clickedPin.parentElement.children.length;
      for (var i = 0; i < childrenNumber; i++) {
        if (clickedPin.parentElement.children[i].classList.contains('pin--active')) {
          clickedPin.parentElement.children[i].classList.remove('pin--active');
        }
      }
      clickedPin.classList.add('pin--active');
      window.showDetailOffer(window.arrayOfAds, Array.prototype.indexOf.call(collectionOfPins, clickedPin), offerDialog);
      offerDialog.classList.remove('hidden');
      // window.addEventListener('keydown', window.utils.escPressHandler(window.card.closeOffer));
      pinMap.removeEventListener('click', window.utils.clickHandler(activatePin));
      pinMap.removeEventListener('keydown', window.utils.enterPressHandler(activatePin));
    }
  };

  pinMap.addEventListener('click', window.utils.clickHandler(activatePin));
  pinMap.addEventListener('keydown', window.utils.enterPressHandler(activatePin));

  return {
    showPins: showPins
  };
})();
