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
  var utils = window.utils;

  var filterFields = {
    fields: ['type', 'price', 'rooms', 'guests', 'features'],
    /**
     * Функция, реализующая логику сравнения при фильтрации
     * @param {string} currentType - текущий тип фильтра, в контексте которого будет осуществляться сравнение
     * @param {*} valueToCompare - переданное из первоначального массива с объявлениями значение для сравнения
     * @return {boolean} - результат сравнения переданного значения из первоначального массива с текущим значением фильтра
     */
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
    someArray.forEach(function (item) {
      someFragment.appendChild(createAnotherDiv(item));
    });

    pinMap.querySelectorAll('div[data-id^="img/avatars/"]').forEach(function (element) {
      element.remove();
    });

    // Закрываю диалоговую панель
    window.card.closeOffer();
    // Отрисовываю сгенерированные объявления на карте
    pinMap.appendChild(someFragment);
    collectionOfPins = pinMap.querySelectorAll('div[data-id^="img/avatars/"]');
  };

  /**
   * Обработчик события нажатия на пин-флажок. Отслеживается клик мыши и нажатие Enter
   * @param {object} evt - данные о событии
   */
  var activatePin = function (evt) {
    var clickedPin = utils.getSelfOrParentByClass(evt.target, 'pin');
    // Наличие в if'е clickedPin необходимо на тот случай, если pin__main подвести под обычный pin и отпустить,
    // то target'ом будет сама карта и при отработки этой функции
    // возникнет ошибка и неправильное присвоение класса pin--active
    if (clickedPin && !clickedPin.classList.contains('pin__main')) {
      Array.prototype.forEach.call(clickedPin.parentElement.children, function (element) {
        if (element.classList.contains('pin--active')) {
          element.classList.remove('pin--active');
        }
      });

      clickedPin.classList.add('pin--active');
      window.showDetailOffer(window.filteredAds, Array.prototype.indexOf.call(collectionOfPins, clickedPin), offerDialog);
      offerDialog.classList.remove('hidden');
    }
  };

  /**
   * Фильтрация объявлений
   */
  var doFilter = function () {
    window.filteredAds = window.arrayOfAds.filter(function (ad) {
      return Object.keys(ad.offer).filter(function (key) {
        // Из объявления из вложенного offer отбираю только нужные для фильтрация атрибуты
        return filterFields.fields.indexOf(key) >= 0 ? true : false;
      }).map(function (key) {
        // Трансформирую отобранные атрибуты в объекты типа "название атрибута": "значение"
        var obj = {};
        obj[key] = ad.offer[key];
        return obj;
      }).reduce(function (accumulator, it) {
        // Формирую массив из объектов
        accumulator.push(it);
        return accumulator;
      }, []).map(function (item) {
        // Прохожу по массиву и возвращаю для каждого элемента массива результат сравнения: true/false
        return filterFields.compare(Object.keys(item)[0], item[Object.keys(item)[0]]);
      }).reduce(function (accumulator, it) {
        // Аггрегирую все результаты проверки через AND в одно значение. Оно и будет проверятся в самом верхнем filter
        accumulator = accumulator && it;
        return accumulator;
      });
    }
    );
    showPins(window.filteredAds);
  };

  pinMap.addEventListener('click', utils.clickHandler(activatePin));
  pinMap.addEventListener('keydown', utils.enterPressHandler(activatePin));

  filters.addEventListener('change', function () {
    utils.debounce(doFilter);
  });

  return {
    showPins: showPins
  };
})();
