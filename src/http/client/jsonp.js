/**
 * JSONP client.
 */

import Promise from '../../promise';

export default function (request) {
    return new Promise((resolve) => {

        var name = request.jsonp || 'callback', callback = '_jsonp' + Math.random().toString(36).substr(2), body = null, handler, script;
        if (request.callback) {
            callback = request.callback;
        }
        handler = (event) => {

            var status = 0;

            if (event.type === 'load' && body !== null) {
                status = 200;
            } else if (event.type === 'error') {
                status = 404;
            }

            resolve(request.respondWith(body, {status}));

            delete window[callback];
            document.body.removeChild(script);
        };

        request.params[name] = callback;

        window[callback] = (result) => {
            body = JSON.stringify(result);
        };

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
}
