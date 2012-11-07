(function () {

    if (!Backbone) {
        throw 'Please include Backbone.js before Backbone.ComputedFields.js';
    }

    var ComputedFields = function () {

    };

    ComputedFields.VERSION = '0.0.1';

    _.extend(ComputedFields.prototype, {

    });

    Backbone.ComputedFields = ComputedFields;

})();