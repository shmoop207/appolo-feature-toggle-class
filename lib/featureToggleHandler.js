var Class = require('appolo-class'),
    _ = require('lodash');

module.exports = Class.define({
    constructor:function(Class,featureToggleManager){
        this.Class = Class;
        this.featureToggleManager = featureToggleManager;
    },

    overrideClass:function(featureToggleName,klass,definitions){

        if(!this.featureToggleManager.isActive(featureToggleName)){
            return;
        }

        var def = klass.prototype;
        def.constructor = klass.prototype.constructor;

        def.$config = _.merge({}, klass.$config);
        def.$config = _.merge(def.$config, definitions.$config, function (a, b) {

            if(_.isArray(a)){
                return b.displayName == "featureToggleUnion" ?  _.union(a, b()) : b
            } else {
                return undefined;
            }
        });

        for (var key in definitions) {

            var func = definitions[key]

            if (key != '$config') {

                if (func.displayName == "featureToggleBefore" || func.displayName == "featureToggleAfter" || func.displayName == "featureToggleWrap") {
                    def[key] = func(def[key]);
                } else {
                    def[key] = func
                }
            }
        }

        Class.define(def);
    }
});
