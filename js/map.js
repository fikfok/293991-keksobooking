'use strict';

window.map = (function () {
  var tokyoBlock = document.querySelector('.tokyo');
  var tokyoFilterContainer = tokyoBlock.querySelector('.tokyo__filters-container');
  var pinMain = tokyoBlock.querySelector('.pin__main');
  var inputOfferAddress = document.querySelector('#address');
  var pinMainSize = {
    width: 74,
    height: 94
  };
  var mapRegion = {
    xMin: pinMainSize.width / -2,
    xMax: tokyoBlock.getBoundingClientRect().width - pinMainSize.width / 2,
    yMin: 200 - pinMainSize.height,
    yMax: tokyoBlock.getBoundingClientRect().height - pinMainSize.height - tokyoFilterContainer.offsetHeight
  };
  var backend = window.backend;
  var form = window.form;
  /**
   * Обработчик нажатия клавиши мыши
   * @param {object} evt - данные о событии
   */
  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var coordsStart = {
      x: evt.clientX,
      y: evt.clientY
    };

    var callbackWithoutParams = true;
    var pointPosition = {
      x: null,
      y: null
    };

    /**
     * Обработчик движения мыши
     * @param {object} evtMove - данные о событии
     */
    var mouseMoveHandler = function (evtMove) {
      // ESLint выдаёт ошибку: 42:38  error  'evt' is already declared in the upper scope  no-shadow
      // Потому пришлось присвоить название evtMove
      evtMove.preventDefault();

      if (inputOfferAddress.style.borderColor) {
        inputOfferAddress.style.borderColor = '';
      }
      var coordsDelta = {
        x: coordsStart.x - evtMove.clientX,
        y: coordsStart.y - evtMove.clientY
      };

      coordsStart = {
        x: evtMove.clientX,
        y: evtMove.clientY
      };

      pointPosition.x = pinMain.offsetLeft - coordsDelta.x;
      pointPosition.y = pinMain.offsetTop - coordsDelta.y;
      pointPosition = window.utils.checkPointPosition(mapRegion, pointPosition);

      pinMain.style.left = pointPosition.x + 'px';
      pinMain.style.top = pointPosition.y + 'px';

    };

    /**
     * Обработчик отпускания клавиши мыши
     * @param {object} evtUp - данные о событии
     */
    var mouseUpHandler = function (evtUp) {
      // ESLint выдаёт ошибку: 71:36  error  'evt' is already declared in the upper scope  no-shadow
      // Потому пришлось присвоить название evtUp
      evtUp.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      // Чтобы была возможность удалить обработчик движения мыши на документе, который синхронизирует положение главного пина и
      // поля с адресом, необходимол было доработать синхронизатор контролов и добавить параметр callbackWithoutParams.
      // Цель: вызывать callback самостоятельно, а не внутри безымянной функции
      document.removeEventListener('mousemove', form.pinMainAddressSync);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    window.synchronizeFields('mousemove', document, null, form.pinMainAddressSync, callbackWithoutParams);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  /**
   * Функция сохранения полученных данных с сервера в xhr запросе и отрисовки полученных объявлений на карте
   * @param {object} data - массив, полученный от сервера
   */
  var getData = function (data) {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      window.arrayOfAds = data;
      window.filteredAds = window.arrayOfAds;
      window.pin.showPins(window.arrayOfAds);
    } else {
      throw new Error('Полученный ответ от сервера не является массивом');
    }
  };

  // Получаю от сервера данные и отрисовываю html-фрагмент на основе массива объявлений
  backend.load(getData, backend.showRequestError);

  tokyoBlock.style.overflow = 'hidden';

})();
