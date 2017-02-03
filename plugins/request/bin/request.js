var Url, async, furtherEncodeUri, qs, request, restify;

async = require('async');

qs = require('qs');

Url = require('url');

restify = require('restify');

request = require('request');

furtherEncodeUri = function(string) {
  string = string.replace(/\!/g, '%21');
  string = string.replace(/\*/g, '%2A');
  string = string.replace(/\(/g, '%28');
  string = string.replace(/\)/g, '%29');
  string = string.replace(/\'/g, '%27');
  return string;
};

module.exports = function(env) {
  var createMiddlewareChain, exp, fixUrl, middlewares_request_chain, oauth;
  env.middlewares.request = {};
  env.middlewares.request.all = [];
  createMiddlewareChain = function() {
    return function(req, res, next) {
      var chain, fn, i, k, middleware, ref1;
      chain = [];
      i = 0;
      ref1 = env.middlewares.request.all;
      fn = function(middleware) {
        return chain.push(function(callback) {
          return middleware(req, res, callback);
        });
      };
      for (k in ref1) {
        middleware = ref1[k];
        fn(middleware);
      }
      if (chain.length === 0) {
        return next();
      }
      return async.waterfall(chain, function() {
        return next();
      });
    };
  };
  middlewares_request_chain = createMiddlewareChain();
  oauth = env.utilities.oauth;
  exp = {};
  exp.apiRequest = (function(_this) {
    return function(req, provider_name, oauthio, callback) {
      if (req.headers == null) {
        req.headers = {};
      }
      return async.parallel([
        function(callback) {
          return env.data.providers.getExtended(provider_name, callback);
        }, function(callback) {
          return env.data.apps.getKeyset(oauthio.k, provider_name, callback);
        }
      ], function(err, results) {
        var oa, oauthv, parameters, provider, ref1;
        if (err) {
          return callback(err);
        }
        provider = results[0], (ref1 = results[1], parameters = ref1.parameters);
        oauthv = oauthio.oauthv && {
          "2": "oauth2",
          "1": "oauth1"
        }[oauthio.oauthv];
        if (oauthv && !provider[oauthv]) {
          return callback(new env.utilities.check.Error("oauthio_oauthv", "Unsupported oauth version: " + oauthv));
        }
        if (provider.oauth2) {
          if (oauthv == null) {
            oauthv = 'oauth2';
          }
        }
        if (provider.oauth1) {
          if (oauthv == null) {
            oauthv = 'oauth1';
          }
        }
        parameters.oauthio = oauthio;
        env.events.emit('request', {
          provider: provider_name,
          key: oauthio.k
        });
        oa = new oauth[oauthv](provider, parameters);
        return oa.request(req, callback);
      });
    };
  })(this);
  fixUrl = function(ref) {
    return ref.replace(/^([a-zA-Z\-_]+:\/)([^\/])/, '$1/$2');
  };
  env.middlewares.request.credentialsNeeded = function(req, res, next) {
    var oauthio, origin, ref, urlinfos;
    oauthio = qs.parse(req.headers.oauthio);
    req.headers.oauthio = qs.parse(req.headers.oauthio);
    if (!oauthio) {
      return res.send(new env.utilities.check.Error("You must provide a valid 'oauthio' http header"));
    }
    oauthio = qs.parse(oauthio);
    if (!oauthio.k) {
      return res.send(new env.utilities.check.Error("oauthio_key", "You must provide a 'k' (key) in 'oauthio' header"));
    }
    origin = null;
    ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
    urlinfos = Url.parse(ref);
    if (!urlinfos.hostname) {
      ref = origin = "http://localhost";
    } else {
      origin = urlinfos.protocol + '//' + urlinfos.host;
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return next();
  };
  exp.allowOriginAndMethods = function(url) {
    return env.server.opts(url, function(req, res, next) {
      var origin, ref, urlinfos;
      origin = null;
      ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
      urlinfos = Url.parse(ref);
      if (!urlinfos.hostname) {
        return next(new restify.InvalidHeaderError('Missing origin or referer.'));
      }
      origin = urlinfos.protocol + '//' + urlinfos.host;
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      if (req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      }
      res.cache({
        maxAge: 120
      });
      res.send(200);
      return next(false);
    });
  };
  exp.raw = function() {
    var doRequest;
    fixUrl = function(ref) {
      return ref.replace(/^([a-zA-Z\-_]+:\/)([^\/])/, '$1/$2');
    };
    doRequest = (function(_this) {
      return function(req, res, next) {
        var cb, oauthio, origin, ref, urlinfos;
        cb = env.server.send(res, next);
        oauthio = req.headers.oauthio;
        if (!oauthio) {
          return cb(new env.utilities.check.Error("You must provide a valid 'oauthio' http header"));
        }
        oauthio = qs.parse(oauthio);
        if (!oauthio.k) {
          return cb(new env.utilities.check.Error("oauthio_key", "You must provide a 'k' (key) in 'oauthio' header"));
        }
        origin = null;
        ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
        urlinfos = Url.parse(ref);
        if (!urlinfos.hostname) {
          ref = origin = "http://localhost";
        } else {
          origin = urlinfos.protocol + '//' + urlinfos.host;
        }
        req.apiUrl = decodeURIComponent(req.params[1]);
        env.data.apps.checkDomain(oauthio.k, ref, function(err, domaincheck) {
          if (err) {
            return cb(err);
          }
          if (!domaincheck) {
            return cb(new env.utilities.check.Error('Origin "' + ref + '" does not match any registered domain/url on ' + env.config.url.host));
          }
        });
        return exp.apiRequest(req, req.params[0], oauthio, function(err, options) {
          var api_request, bodyParser, content_type, sendres;
          if (err) {
            return cb(err);
          }
          delete options.headers["Cookie"];
          delete options.headers["X-Requested-With"];
          api_request = null;
          sendres = function() {
            api_request.pipefilter = function(response, dest) {
              dest.setHeader('Access-Control-Allow-Origin', origin);
              return dest.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            };
            api_request.pipe(res);
            return api_request.once('end', function() {
              return next(false);
            });
          };
          content_type = req.headers['content-type'];
          if ((req.headers['content-type'] != null) && req.headers['content-type'].indexOf('application/x-www-form-urlencoded') !== -1) {
            bodyParser = restify.bodyParser({
              mapParams: false
            });
            return bodyParser[0](req, res, function() {
              return bodyParser[1](req, res, function() {
                options.headers['Content-type'] = 'application/x-www-form-urlencoded';
                options.body = furtherEncodeUri(qs.stringify(req.body));
                delete options.headers['Content-Length'];
                api_request = request(options);
                return sendres();
              });
            });
          } else if ((req.headers['content-type'] != null) && req.headers['content-type'].indexOf('application/json') !== -1) {
            bodyParser = restify.bodyParser({
              mapParams: false
            });
            return bodyParser[0](req, res, function() {
              return bodyParser[1](req, res, function() {
                options.headers['Content-Type'] = content_type;
                options.body = JSON.stringify(req.body);
                delete options.headers['Content-Length'];
                api_request = request(options);
                return sendres();
              });
            });
          } else {
            api_request = request(options);
            req.headers = {};
            api_request = req.pipe(api_request);
            return sendres();
          }
        });
      };
    })(this);
    env.server.opts(new RegExp('^/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), function(req, res, next) {
      var origin, ref, urlinfos;
      origin = null;
      ref = fixUrl(req.headers['referer'] || req.headers['origin'] || "http://localhost");
      urlinfos = Url.parse(ref);
      if (!urlinfos.hostname) {
        return next(new restify.InvalidHeaderError('Missing origin or referer.'));
      }
      origin = urlinfos.protocol + '//' + urlinfos.host;
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      if (req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      }
      res.cache({
        maxAge: 120
      });
      res.send(200);
      return next(false);
    });
    env.server.get(new RegExp('^/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest);
    env.server.post(new RegExp('^/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest);
    env.server.put(new RegExp('^/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest);
    env.server.patch(new RegExp('^/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest);
    return env.server.del(new RegExp('^/request/([a-zA-Z0-9_\\.~-]+)/(.*)$'), middlewares_request_chain, doRequest);
  };
  return exp;
};
