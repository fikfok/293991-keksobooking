'use strict';

window.sinchronizeFields = (function () {
  /**
   * Синхронизация полей формы
   * @param {string} eventType - тип события, по которуму будет синхронизация
   * @param {object} masterElement - первый элемент, который является инициатором
   * @param {object} slaveElement - второй элемент, состояние которого необходимо изменить
   * @param {function} callback - функция сравнения элементов
   * @param {boolean} callbackWithoutParams - признак того, что бы запускать не безымянную функцию, а сам callback без параметров,
   * что бы его потом удалить методов removeEventListener
   */
  window.synchronizeFields = function (eventType, masterElement, slaveElement, callback, callbackWithoutParams) {
    if (window.utils.checkCallback(callback)) {
      if (callbackWithoutParams) {
        masterElement.addEventListener(eventType, callback);
      } else {
        masterElement.addEventListener(eventType, function () {
          callback(masterElement, slaveElement);
        });
      }
    }
  };
})();
