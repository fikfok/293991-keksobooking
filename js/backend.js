'use strict';

// Модуль для работы с сервером
window.backend = (function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var RESPONSE_TYPE = 'json';

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

  var save = function (data, onLoad, onError) {
    ajax('POST', RESPONSE_TYPE, SERVER_URL, TIMEOUT, onLoad, onError, data);
  };

  var load = function (onLoad, onError) {
    ajax('GET', RESPONSE_TYPE, SERVER_URL + '/data', TIMEOUT, onLoad, onError, null);
  };

  return {
    load: load,
    save: save
  };
})();
