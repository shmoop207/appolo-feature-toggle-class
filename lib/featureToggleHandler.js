var _ = require('lodash'),
featureToggleClass = require('./featureToggleClass');

module.exports = function(featureToggleManager,Class) {

        var overrides = featureToggleClass.getOverrides();

        _.forEach(overrides, function (override) {

            if(!featureToggleManager.isActive()){
                return;
            }

            var def = override.klass.prototype;
            def.constructor = override.klass.prototype.constructor;

            def.$config = _.merge({}, override.klass.$config);
            def.$config = _.merge(def.$config, override.definitions.$config, function (a, b) {

                if(_.isArray(a)){
                    return b.displayName == "featureToggleUnion" ?  _.union(a, b()) : b
                } else {
                    return undefined;
                }
            });

            for (var key in override.definitions) {

                var func = override.definitions[key]

                if (key != '$config') {

                    if (func.displayName == "featureToggleBefore" || func.displayName == "featureToggleAfter" || func.displayName == "featureToggleWrap") {
                        def[key] = func(def[key]);
                    } else {
                        def[key] = func
                    }
                }
            }

            Class.define(def);
        });
}