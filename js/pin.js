'use strict';

// Модуль для отрисовки пина и взаимодействия с ним
window.pin = (function () {
  var tokyoBlock = document.querySelector('.tokyo');
  var offerDialog = tokyoBlock.querySelector('#offer-dialog');
  var pinMap = tokyoBlock.querySelector('.tokyo__pin-map');
  var filters = tokyoBlock.querySelector('.tokyo__filters');
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

    pinMap.querySelectorAll('div[data-id^="img/avatars/"]').forEach(function (item) {
      item.remove();
    });

    // Отрисовываю сгенерированные объявления на карте
    pinMap.appendChild(someFragment);
    collectionOfPins = pinMap.querySelectorAll('div[data-id^="img/avatars/"]');
  };

  /**
   * Обработчик события нажатия на пин-флажок. Отслеживается клик мыши и нажатие Enter
   * @param {object} evt - данные о событии
   */
  var activatePin = function (evt) {
    var clickedPin = window.utils.getSelfOrParentByClass(evt.target, 'pin');
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
    }
  };

  pinMap.addEventListener('click', window.utils.clickHandler(activatePin));
  pinMap.addEventListener('keydown', window.utils.enterPressHandler(activatePin));

  var filterFields = {
    fields: ['type', 'price', 'rooms', 'guests', 'features'],
    compare: function (currentType, valueToCompare) {
      var result = null;
      var trueFeatures = [];
      switch (currentType) {
        case 'type':
          switch (filters.housing_type.value) {
            case 'any':
              result = true;
              break;
            default:
              result = (valueToCompare.toString() === filters.housing_type.value.toString());
              break;
          }
          break;
        case 'price':
          switch (filters.housing_price.value) {
            case 'any':
              result = true;
              break;
            case 'middle':
              result = (parseInt(valueToCompare, 10) >= 10000 && parseInt(valueToCompare, 10) <= 50000);
              break;
            case 'low':
              result = (parseInt(valueToCompare, 10) < 10000);
              break;
            case 'high':
              result = (parseInt(valueToCompare, 10) > 50000);
              break;
          }
          break;
        case 'rooms':
          switch (filters['housing_room-number'].value) {
            case 'any':
              result = true;
              break;
            default:
              result = (valueToCompare.toString() === filters['housing_room-number'].value.toString());
              break;
          }
          break;
        case 'guests':
          switch (filters['housing_guests-number'].value) {
            case 'any':
              result = true;
              break;
            default:
              result = (valueToCompare.toString() === filters['housing_guests-number'].value.toString());
              break;
          }
          break;
        case 'features':
          filters.feature.forEach(function (item) {
            if (item.checked) {
              trueFeatures.push(item.value);
            }
            result = JSON.stringify(trueFeatures) === JSON.stringify(valueToCompare);
          });
          break;
      }
      return result;
    }
  };

  filters.addEventListener('change', function (evt) {
    var ar = window.arrayOfAds.filter(function (ad) {
      return Object.keys(ad.offer).filter(function (key) {
        return filterFields.fields.indexOf(key) >= 0 ? true : false;
      }).map(function (key) {
        var obj = {};
        obj[key] = ad.offer[key];
        return obj;
      }).reduce(function (accumulator, it) {
        accumulator.push(it);
        return accumulator;
      }, []).map(function (item) {
        return filterFields.compare(Object.keys(item)[0], item[Object.keys(item)[0]]);
      }).reduce(function (accumulator, it) {
        accumulator = accumulator && it;
        return accumulator;
      });
    }
    );
    console.log(pinMap.querySelectorAll('pin'));

    showPins(ar);
  });

  return {
    showPins: showPins
  };
})();
