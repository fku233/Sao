var fku = {
    fetch: function (options) {
        var url = options.url;
        var method = options.method || 'GET';
        var headers = options.headers || {};
        var body = options.body;
        var dataType = options.dataType || 'text';

        window.fetch(url, {
            method: method,
            headers: headers,
            body: body
        }).then(function (response) {
            if (response.ok) {
                var nextRes;
                if (dataType == 'text') {
                    nextRes = response.text();
                }
                if (dataType == 'json') {
                    nextRes = response.json();
                }
                nextRes.then(function (data) {
                    options.success(data);
                });
            } else {
                options.error(response);
            }
        }).catch(function (e) {
            options.fail(e);
        });
    },
    get: function (url, success) {
        fku.fetch({
            url: url,
            method: 'GET',
            success: success
        });
    },
    getJSON: function (url, success) {
        fku.fetch({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: success
        });
    },
    post: function (url, data, success) {
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        fku.fetch({
            url: url,
            method: 'POST',
            headers: headers,
            success: success,
            body: data
        });
    }
}