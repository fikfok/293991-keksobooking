'use strict';

window.sinchronizeFields = (function () {
  /**
   * Синхронизация полей формы
   * @param {object} masterElement - первый элемент, который является инициатором
   * @param {object} slaveElement - второй элемент, состояние которого необходимо изменить
   * @param {function} callback - функция сравнения элементов
   */
  window.synchronizeFields = function (masterElement, slaveElement, callback) {
    masterElement.addEventListener('change', function () {
      callback(masterElement, slaveElement);
    });
  };
})();
