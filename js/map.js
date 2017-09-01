'use strict';

window.map = (function () {
  var arrayOfAds = window.data.arrayOfAds;
  var tokyoBlock = document.querySelector('.tokyo');
  var tokyoFilterContainer = tokyoBlock.querySelector('.tokyo__filters-container');
  var pinMain = tokyoBlock.querySelector('.pin__main');
  var inputOfferAddress = document.getElementById('address');
  var pinMainSize = {
    width: 74,
    height: 94
  };

  var mapRegion = {
    xMin: 0 - pinMainSize.width / 2,
    xMax: tokyoBlock.getBoundingClientRect().width - pinMainSize.width / 2,
    yMin: 200 - pinMainSize.height,
    yMax: tokyoBlock.getBoundingClientRect().height - pinMainSize.height - tokyoFilterContainer.offsetHeight
  };

  // Генерирую и отрисовываю html-фрагмент на основе массива объявлений
  window.pin.generateAndShowPinsOfAds(arrayOfAds);

  // Отрисовываю конкретное объявление в детальном виде
  window.card.showAdInDetailView(arrayOfAds, 0);

  tokyoBlock.style.overflow = 'hidden';

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

    var trueX = null;
    var trueY = null;
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

      trueX = Math.floor(pointPosition.x + pinMainSize.width / 2);
      trueY = Math.floor(pointPosition.y + pinMainSize.height);

      inputOfferAddress.value = 'x: ' + trueX + ', ' + 'y: ' + trueY;
    };

    /**
     * Обработчик отпускания клавиши мыши
     * @param {object} evtUp - данные о событии
     */
    var mouseUpHandler = function (evtUp) {
      evtUp.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  inputOfferAddress.value = 'x: ' + (pinMain.offsetLeft + pinMainSize.width / 2) + ', ' + 'y: ' + (pinMain.offsetTop + pinMainSize.height);
})();
