var _ = require('lodash'),
    featureToggleClass = require('./lib/featureToggleClass'),
    featureToggleHandler = require('../../lib/featureToggleHandler');

module.exports.module = function (options) {

    return function (env, logger,featureToggleManager, inject,appolo, callback) {

        featureToggleHandler(featureToggleManager,appolo.Class)

        callback();
    }

}

module.exports.featureToggleClass = featureToggleClass