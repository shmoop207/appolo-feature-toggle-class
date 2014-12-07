var _ = require('lodash'),
    FeatureToggleClass = require('./lib/featureToggleClass'),
    FeatureToggleHandler = require('./lib/featureToggleHandler');

module.exports.module = function (options) {

    return function (env, logger,featureToggleManager, inject,appolo, callback) {

        var featureToggleHandler  = new FeatureToggleHandler(appolo.Class,featureToggleManager);

        var featureToggleClass  = new FeatureToggleClass(featureToggleHandler);

        callback();
    }

}

module.exports.featureToggleClass = featureToggleClass;