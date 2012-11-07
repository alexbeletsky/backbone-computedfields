/*

    1. If computed field is updated, dependent field should be triggered
        netPrice
        grossPrice

            setting gross price, silently
                this.mode.set({grossPrice: 100}, {silent: true});
                call validation
                if model is valid
                this.model.trigger('change:grossPrice', value)
                    'change:netPrice' should be raised

*/

(function () {

    if (!Backbone) {
        throw 'Please include Backbone.js before Backbone.ComputedFields.js';
    }

    var ComputedFields = function (model) {
        this.model = model;
        this._computedFields = [];

        this.initialize();
    };

    ComputedFields.VERSION = '0.0.1';

    _.extend(ComputedFields.prototype, {
        initialize: function () {
            _.bindAll(this);

            this._lookUpComputedFields();
            this._decorateModel();
        },

        _lookUpComputedFields: function () {
            for (var obj in this.model) {
                var field = this.model[obj];

                if (field && (field.set || field.get)) {
                    this._computedFields.push({name: obj, field: field});
                }
            }
        },

        _decorateModel: function () {
            this._originalGet = this.model.get;
            this.model.get = this._get;
        },

        _get: function (attr) {
            var computedField = this.computedField(attr);
            if (computedField && computedField.get) {
                var fields = _.reduce(computedField.depends, function (memo, field) {
                    memo[field] = this.model.attributes[field];
                    return memo;
                }, {}, this);

                return computedField.get.call(this.model, fields);
            }

            return this._originalGet.apply(this.model, arguments);
        },

        computedField: function (attr) {
            var computedField = _.find(this._computedFields, function (cf) {
                return cf.name === attr;
            });

            return computedField && computedField.field;
        }


    });

    Backbone.ComputedFields = ComputedFields;

})();