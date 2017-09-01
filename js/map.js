'use strict';

window.map = (function () {
  var arrayOfAds = window.data.arrayOfAds;
  var pinMain = document.querySelector('.pin__main');
  var inputOfferAddress = document.getElementById('address');
  var pinMainSize = {
    width: 74,
    height: 94
  };

  var mapScope = {
    xMin: 300 + pinMainSize.width / 4,
    xMax: 900 + pinMainSize.width / 4,
    yMin: 100 + pinMainSize.height / 2,
    yMax: 500 + pinMainSize.height / 2
  };

  // Генерирую и отрисовываю html-фрагмент на основе массива объявлений
  window.pin.generateAndShowPinsOfAds(arrayOfAds);

  // Отрисовываю конкретное объявление в детальном виде
  window.card.showAdInDetailView(arrayOfAds, 0);

  pinMain.addEventListener('mousedown', function (evtDown) {
    evtDown.preventDefault();

    var coordsStart = {
      x: evtDown.clientX,
      y: evtDown.clientY
    };

    var trueX = null;
    var trueY = null;
    var currentX = null;
    var currentY = null;

    var mouseMoveHandler = function (evtMove) {
      evtMove.preventDefault();

      var coordsDelta = {
        x: coordsStart.x - evtMove.clientX,
        y: coordsStart.y - evtMove.clientY
      };

      coordsStart = {
        x: evtMove.clientX,
        y: evtMove.clientY
      };

      currentX = pinMain.offsetLeft - coordsDelta.x;
      currentY = pinMain.offsetTop - coordsDelta.y;

      if (currentX < mapScope.xMin ) {
        currentX = mapScope.xMin;
      } else if (currentX > mapScope.xMax) {
        currentX = mapScope.xMax;
      }

      if (currentY < mapScope.yMin) {
        currentY = mapScope.yMin;
      } else if (currentY > mapScope.yMax) {
        currentY = mapScope.yMax;
      }

      pinMain.style.left = currentX + 'px';
      pinMain.style.top = currentY + 'px';

      trueX = currentX + pinMainSize.width / 2;
      trueY = currentY + pinMainSize.height;

      inputOfferAddress.value = 'x: ' + trueX + ', ' + 'y: ' + trueY;
    };

    var mouseUpHandler = function (evtUp) {
      evtUp.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
