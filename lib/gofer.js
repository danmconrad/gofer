/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Generated by CoffeeScript 2.0.0-beta7
void function () {
  var applyBaseUrl, buildUserAgent, cache$, cache$1, extend, Gofer, Hub, isJsonResponse, merge, parseDefaults, resolveOptional, safeParseJSON;
  Hub = require('./hub');
  cache$ = require('./helpers');
  resolveOptional = cache$.resolveOptional;
  parseDefaults = cache$.parseDefaults;
  applyBaseUrl = cache$.applyBaseUrl;
  buildUserAgent = cache$.buildUserAgent;
  merge = cache$.merge;
  cache$1 = require('./json');
  safeParseJSON = cache$1.safeParseJSON;
  isJsonResponse = cache$1.isJsonResponse;
  extend = require('lodash').extend;
  Gofer = function () {
    function Gofer(config, param$) {
      var cache$2, instance$;
      instance$ = this;
      this.request = function (a, b, c) {
        return Gofer.prototype.request.apply(instance$, arguments);
      };
      this.hub = param$;
      cache$2 = parseDefaults(config, this.serviceName);
      this.defaults = cache$2.defaults;
      this.endpointDefaults = cache$2.endpointDefaults;
      if (null != this.hub)
        this.hub;
      else
        this.hub = Hub();
    }
    Gofer.prototype['with'] = function (overrides) {
      var copy, endpointDefaults, endpointName;
      copy = new this.constructor({}, this.hub);
      copy.defaults = merge(this.defaults, overrides);
      copy.endpointDefaults = {};
      for (endpointName in this.endpointDefaults) {
        endpointDefaults = this.endpointDefaults[endpointName];
        copy.endpointDefaults[endpointName] = merge(endpointDefaults, overrides);
      }
      return copy;
    };
    Gofer.prototype.clone = function () {
      return this['with']({});
    };
    Gofer.prototype.request = function (uri, options, cb) {
      var cache$2;
      cache$2 = resolveOptional(uri, options, cb);
      options = cache$2.options;
      cb = cache$2.cb;
      return this._request(options, cb);
    };
    Gofer.prototype.put = function (uri, options, cb) {
      var cache$2;
      cache$2 = resolveOptional(uri, options, cb);
      options = cache$2.options;
      cb = cache$2.cb;
      options.method = 'PUT';
      return this._request(options, cb);
    };
    Gofer.prototype.del = function (uri, options, cb) {
      var cache$2;
      cache$2 = resolveOptional(uri, options, cb);
      options = cache$2.options;
      cb = cache$2.cb;
      options.method = 'DELETE';
      return this._request(options, cb);
    };
    Gofer.prototype.head = function (uri, options, cb) {
      var cache$2;
      cache$2 = resolveOptional(uri, options, cb);
      options = cache$2.options;
      cb = cache$2.cb;
      options.method = 'HEAD';
      return this._request(options, cb);
    };
    Gofer.prototype.post = function (uri, options, cb) {
      var cache$2;
      cache$2 = resolveOptional(uri, options, cb);
      options = cache$2.options;
      cb = cache$2.cb;
      options.method = 'POST';
      return this._request(options, cb);
    };
    Gofer.prototype.patch = function (uri, options, cb) {
      var cache$2;
      cache$2 = resolveOptional(uri, options, cb);
      options = cache$2.options;
      cb = cache$2.cb;
      options.method = 'PATCH';
      return this._request(options, cb);
    };
    Gofer.prototype.registerEndpoint = function (endpointName, endpointFn) {
      Object.defineProperty(this, endpointName, {
        configurable: true,
        get: function () {
          var request, value;
          request = this.requestWithDefaults({ endpointName: endpointName });
          value = endpointFn(request);
          Object.defineProperty(this, endpointName, { value: value });
          return value;
        }
      });
      return this;
    };
    Gofer.prototype.registerEndpoints = function (endpointMap) {
      var handler, name;
      for (name in endpointMap) {
        handler = endpointMap[name];
        this.registerEndpoint(name, handler);
      }
      return this;
    };
    Gofer.prototype.addOptionMapper = function (mapper) {
      this._mappers = this._mappers.concat([mapper]);
      return this;
    };
    Gofer.prototype.clearOptionMappers = function () {
      return this._mappers = [];
    };
    Gofer.prototype.requestWithDefaults = function (defaults) {
      return function (this$) {
        return function (uri, options, cb) {
          var cache$2;
          cache$2 = resolveOptional(uri, options, cb);
          options = cache$2.options;
          cb = cache$2.cb;
          options = merge(defaults, options);
          return this$._request(options, cb);
        };
      }(this);
    };
    Gofer.prototype._getDefaults = function (defaults, options) {
      var endpointName;
      endpointName = options.endpointName;
      if (null != endpointName && null != this.endpointDefaults[endpointName])
        defaults = merge(defaults, this.endpointDefaults[endpointName]);
      return defaults;
    };
    Gofer.prototype.applyBaseUrl = applyBaseUrl;
    Gofer.prototype._applyMappers = function (originalOptions) {
      return this._mappers.reduce(function (this$) {
        return function (options, mapper) {
          return mapper.call(this$, options);
        };
      }(this), originalOptions);
    };
    Gofer.prototype._request = function (options, cb) {
      var cleanedQs, defaults, err, key, value;
      defaults = this._getDefaults(this.defaults, options);
      if (null != options.methodName)
        options.methodName;
      else
        options.methodName = (null != options.method ? options.method : 'get').toLowerCase();
      if (null != this.serviceName)
        options.serviceName = this.serviceName;
      if (null != this.serviceVersion)
        options.serviceVersion = this.serviceVersion;
      try {
        options = this._applyMappers(merge(defaults, options));
      } catch (e$) {
        err = e$;
        return cb(err);
      }
      if (null != options.headers)
        options.headers;
      else
        options.headers = {};
      if (null != options.headers['User-Agent'])
        options.headers['User-Agent'];
      else
        options.headers['User-Agent'] = buildUserAgent(options);
      if (null != options.qs && typeof options.qs === 'object') {
        cleanedQs = {};
        for (key in options.qs) {
          value = options.qs[key];
          if ('undefined' !== typeof value && null != value)
            cleanedQs[key] = value;
        }
        options.qs = cleanedQs;
      }
      if (null != options.logData)
        options.logData;
      else
        options.logData = {};
      extend(options.logData, {
        serviceName: options.serviceName,
        endpointName: options.endpointName,
        methodName: options.methodName,
        pathParams: options.pathParams
      });
      return this.hub.fetch(options, function (err, body, response, responseData) {
        var data, parseJSON;
        parseJSON = null != options.parseJSON ? options.parseJSON : isJsonResponse(response, body);
        if (!parseJSON)
          return cb(err, body, responseData, response);
        data = safeParseJSON(body);
        return cb(null != err ? err : data.error, data.result, responseData, response);
      });
    };
    Gofer.prototype._mappers = [function (opts) {
        var baseUrl;
        baseUrl = opts.baseUrl;
        if (null != baseUrl) {
          delete opts.baseUrl;
          return this.applyBaseUrl(baseUrl, opts);
        } else {
          return opts;
        }
      }];
    return Gofer;
  }();
  Gofer.prototype.fetch = Gofer.prototype.request;
  Gofer.prototype.get = Gofer.prototype.request;
  module.exports = Gofer;
  Gofer['default'] = Gofer;
}.call(this);
