/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var filterParams = function (value) {
    var params = {};
    Object.entries(value).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (value !== undefined && value !== "") {
            params[key] = value;
        }
    });
    return params;
};
var trimParams = function (value) {
    return Object.entries(filterParams(value)).map(function (_a) {
        var value = _a[0], key = _a[1];
        return "".concat(value, "=").concat(key);
    }).join("&");
};
var trimFormDataParams = function (value) {
    var formData = new FormData();
    Object.entries(filterParams(value)).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (value === undefined || value === "") ;
        else if (value instanceof Object) {
            formData.append(key, JSON.stringify(value));
        }
        else {
            formData.append(key, value);
        }
    });
    return formData;
};

var optionInit = function (url, params) {
    var defaultConfig = {
        method: "GET",
        // credentials: 'include',
        handleErrorMessage: function (response) {
            console.log(response);
            // antdMessage.error(response?.message);
        },
        handleCatchMessage: function (error) {
            console.log(error);
        }
    };
    var _a = Object.assign({}, defaultConfig, params), body = _a.body, rawJson = _a.rawJson, formdata = _a.formdata, handleErrorMessage = _a.handleErrorMessage, handleCatchMessage = _a.handleCatchMessage, other = __rest(_a, ["body", "rawJson", "formdata", "handleErrorMessage", "handleCatchMessage"]);
    var options = Object.assign({}, other);
    if (other.method === "GET" && body) {
        url += "?" + trimParams(body);
    }
    else if (other.method === "POST") {
        if (rawJson) {
            options.headers = {
                "Content-Type": "application/json; charset=utf-8"
            };
            options.body = JSON.stringify(filterParams(rawJson));
        }
        else if (formdata) {
            options.body = trimFormDataParams(formdata);
        }
    }
    return [url, options || {}, { handleErrorMessage: handleErrorMessage, handleCatchMessage: handleCatchMessage }];
};
function Request(url, params) {
    var _a = optionInit(url, params !== null && params !== void 0 ? params : {}), urls = _a[0], options = _a[1], callback = _a[2];
    return fetch(urls, options)
        .then(function (body) {
        return body.json();
    })
        .then(function (res) {
        var code = res.code, result = res.result;
        if (code === 0) {
            return result;
        }
        else {
            callback.handleErrorMessage(res);
        }
    })
        .catch(function (error) {
        callback.handleCatchMessage(error);
    });
}

export { Request as default };
