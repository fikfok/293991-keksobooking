'use strict';

// Модуль для работы с сервером
window.backend = (function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var TIMEOUT = 15000;
  var RESPONSE_TYPE = 'json';
  var errorMessageNode = null;
  var utils = window.utils;

  /**
   * Создание html-узла с сообщением об ошибке в XMLHttpRequest запросе
   * @return {object} - html-узел
   */
  var createRequestErrorBlock = function () {
    var newElement = document.createElement('div');
    newElement.style.zIndex = 100;
    newElement.style.marginTop = '250px';
    newElement.style.marginLeft = 'auto';
    newElement.style.marginRight = 'auto';
    newElement.style.width = '1200px';
    newElement.style.textAlign = 'center';
    newElement.style.backgroundColor = 'red';
    newElement.style.position = 'absolute';
    newElement.style.left = 0;
    newElement.style.right = 0;
    newElement.style.fontSize = '30px';
    newElement.classList.add('ajax-error-message');
    document.body.insertAdjacentElement('afterbegin', newElement);
    return newElement;
  };

  /**
   * Вывод сообщения с ошибкой при отправке/получении XMLHttpRequest запроса
   * @param {string} errorMessage - сообщение с ошибкой
   * @constructor
   */
  var showRequestErrorBlock = function (errorMessage) {
    errorMessageNode.textContent = errorMessage;
    errorMessageNode.classList.remove('hidden');
    window.addEventListener('click', utils.clickHandler(closeRequestErrorBlock));
    window.addEventListener('keydown', utils.escPressHandler(closeRequestErrorBlock));
  };

  /**
   * Закрытие сообщения с ошибкой, возникшей при XMLHttpRequest запросе
   */
  var closeRequestErrorBlock = function () {
    errorMessageNode.classList.add('hidden');
    window.removeEventListener('click', utils.clickHandler(closeRequestErrorBlock));
    window.removeEventListener('keydown', utils.escPressHandler(closeRequestErrorBlock));
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
    if (utils.checkCallback(onLoad) && utils.checkCallback(onError)) {
      ajax('POST', RESPONSE_TYPE, SERVER_URL, TIMEOUT, onLoad, onError, data);
    }
  };

  /**
   * Функция для получения ответа от сервера
   * @param {function} onLoad - функция, выполняемая при успешном выполнении запроса
   * @param {function} onError - функция, выполняемая при ошибке выполенния запрос
   */
  var load = function (onLoad, onError) {
    if (utils.checkCallback(onLoad) && utils.checkCallback(onError)) {
      ajax('GET', RESPONSE_TYPE, SERVER_URL + '/data', TIMEOUT, onLoad, onError, null);
    }
  };

  errorMessageNode = createRequestErrorBlock();

  return {
    load: load,
    save: save,
    showRequestError: showRequestErrorBlock
  };
})();
