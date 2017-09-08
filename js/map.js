'use strict';

window.map = (function () {
  var tokyoBlock = document.querySelector('.tokyo');
  var tokyoFilterContainer = tokyoBlock.querySelector('.tokyo__filters-container');
  var pinMain = tokyoBlock.querySelector('.pin__main');
  var inputOfferAddress = document.getElementById('address');
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

  /**
   * Обработчик нажатия клавиши мыши
   * @param {object} evtMove - данные о событии
   */
  pinMain.addEventListener('mousedown', function (evtDown) {
    evtDown.preventDefault();

    var coordsStart = {
      x: evtDown.clientX,
      y: evtDown.clientY
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
      evtUp.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      // Чтобы была возможность удалить обработчик движения мыши на документе, который синхронизирует положение главного пина и
      // поля с адресом, необходимол было доработать синхронизатор контролов и добавить параметр callbackWithoutParams.
      // Цель: вызывать callback самостоятельно, а не внутри безымянной функции
      document.removeEventListener('mousemove', window.form.pinMainAddressSync);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    window.synchronizeFields('mousemove', document, null, window.form.pinMainAddressSync, callbackWithoutParams);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  var getData = function (data) {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      window.arrayOfAds = data;
      window.pin.showPins(window.arrayOfAds);
      // Этот вызов деактивирует активный пин
      window.card.closeOffer();
    } else {
      throw new Error('Полученный ответ от сервера не является массивом');
    }
  };

  // Генерирую и отрисовываю html-фрагмент на основе массива объявлений
  window.backend.load(getData, window.backend.showRequestError);
  // А этот вызов закрывает диалоговое окно с детальным описанием
  window.card.closeOffer();

  tokyoBlock.style.overflow = 'hidden';

})();
