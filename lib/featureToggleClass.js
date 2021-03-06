var Class = require('appolo-class'),
    _ = require('lodash'),
    Q = require('q');

module.exports = Class.define({

    constructor: function (featureToggleHandler) {

        this.featureToggleHandler = featureToggleHandler;
    },

    define: function (klass, name, definitions) {

        this.featureToggleHandler.overrideClass(name,klass,definitions);
    },

    union:function(data){
        var func = function(){
            return data;
        }

        func.displayName = "featureToggleUnion";

        return func;
    },

    after: function (fn) {

        var func = function (origin) {
            return function () {
                var result = origin.apply(this, arguments);

                var args = [result].concat(_.toArray(arguments));

                return fn.apply(this, args);
            };
        }

        func.displayName = "featureToggleBefore";

        return func;
    },

    before: function (fn) {

        var func = function (origin) {
            return function () {
                fn.apply(this, arguments);
                return origin.apply(this, arguments);

            }
        }

        func.displayName = "featureToggleAfter";

        return func;
    },

    wrap: function (fn) {
        var func = function (origin) {
            return function () {
                return fn.apply(this, [origin.bind(this)].concat(_.toArray(arguments)));
            };
        }

        func.displayName = "featureToggleWrap";

        return func;
    },

    getOverrides: function () {
        return this._overrides;
    }
});




