module.exports = function(app) {
  app.filter('capitalize', function() {
    return function(str) {
      if (!str || !str[0]) {
        return "";
      }
      return str[0].toUpperCase() + str.substr(1);
    };
  });
  app.filter('minimize_key', function() {
    return function(str) {
      return str.substr(0, 5) + '...' + str.substr(str.length - 4, str.length - 1);
    };
  });
  return app.filter('count', function() {
    return function(object) {
      var count, k, v;
      count = 0;
      for (k in object) {
        v = object[k];
        count++;
      }
      return count;
    };
  });
};
