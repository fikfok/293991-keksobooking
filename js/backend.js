'use strict';

// Модуль для работы с сервером
window.backend = (function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var RESPONSE_TYPE = 'json';

  /**
   * Вывод сообщения с ошибкой при отправке/получении ajax запроса
   * @param {string} errorMessage - сообщение с ошибкой
   * @constructor
   */
  var showRequestError = function (errorMessage) {
    var errorMessageNode = document.querySelector('.ajax-error-message');
    if (!errorMessageNode) {
      var node = document.createElement('div');
      node.style.cssText = 'z-index: 100; margin-top: 250px; width: 1200px; margin-left: auto;';
      node.style.cssText += 'margin-right: auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.classList.add('ajax-error-message');
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    } else {
      errorMessageNode.textContent = errorMessage;
      errorMessageNode.classList.remove('hidden');
    }
    window.addEventListener('click', window.utils.clickHandler(closeRequestError));
  };

  /**
   * Закрытие сообщения с ошибкой, возникшей при XMLHttpRequest запросе
   */
  var closeRequestError = function () {
    var errorMessageNode = document.querySelector('.ajax-error-message');
    errorMessageNode.classList.add('hidden');
    window.removeEventListener('click', window.utils.clickHandler(closeRequestError));
  };

  /**
   * Функция в общем виде для XMLHttpRequest апросов
   * @param {string} method - тип метода запроса (GET, POST)
   * @param {string} responseType - тип данных запроса
   * @param {string} URL - адрес сервиса
   * @param {number} timeout - время таймаута в мс
   * @param {function} onSuccess - функция, выполняемая при успешном выполнении запроса
   * @param {function} onError - функция, выполняемая при ошибке выполенния запроса
   * @param {Object} data - объект с данными, введёнными пользователем
   */
  var ajax = function (method, responseType, URL, timeout, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = responseType;
    xhr.timeout = timeout;

    xhr.open(method, URL);

    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        switch (xhr.status) {
          case 200:
            onSuccess(xhr.response);
            break;
          case 401:
            onError('Неавторизованный запрос');
            break;
          case 403:
            onError('Доступ к ресурсу запрещен');
            break;
          case 404:
            onError('Ресурс не найден');
            break;
          case 405:
            onError('Недопустимый метод');
            break;
          default:
            onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
        }
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.send(data);
  };

  /**
   * Функция для отправки запроса на сервер. Сохранение данных, введённых пользователем
   * @param {Object} data - данные, введённые пользвоателем
   * @param {function} onLoad - функция, выполняемая при успешном выполнении запроса
   * @param {function} onError - функция, выполняемая при ошибке выполенния запрос
   */
  var save = function (data, onLoad, onError) {
    if (window.utils.checkCallback(onLoad) && window.utils.checkCallback(onError)) {
      ajax('POST', RESPONSE_TYPE, SERVER_URL, TIMEOUT, onLoad, onError, data);
    }
  };

  /**
   * Функция для получения ответа от сервера
   * @param {function} onLoad - функция, выполняемая при успешном выполнении запроса
   * @param {function} onError - функция, выполняемая при ошибке выполенния запрос
   */
  var load = function (onLoad, onError) {
    if (window.utils.checkCallback(onLoad) && window.utils.checkCallback(onError)) {
      ajax('GET', RESPONSE_TYPE, SERVER_URL + '/data', TIMEOUT, onLoad, onError, null);
    }
  };

  return {
    load: load,
    save: save,
    showRequestError: showRequestError
  };
})();
