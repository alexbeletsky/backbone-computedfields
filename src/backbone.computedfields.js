/*
    TODO: Place licence
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
            this._calculateInitialValues();
        },

        _lookUpComputedFields: function () {
            for (var obj in this.model) {
                var field = this.model[obj];

                if (field && (field.set || field.get)) {
                    this._computedFields.push({name: obj, field: field});
                }
            }
        },

        _calculateInitialValues: function () {
            _.each(this._computedFields, function (computedField) {
                var fieldName = computedField.name;
                var field = computedField.field;
                
                var updateComputedFieldValue = _.bind(function () {
                    var value = this._computeFieldValue(field);
                    this.model.set(fieldName, value, { triggeredBy: 'updateComputedFieldValue' });
                }, this);

                var updateDependentFieldsValue = _.bind(function (model, value, options) {
                    // if dependent field changed by set in updateComputedFieldValue we'll skip it,
                    // since it cause cycle
                    if (options && options.triggeredBy === 'updateComputedFieldValue') {
                        return;
                    }

                    var fields = this._dependentFields(field.depends);
                    
                    field.set.call(this.model, value, fields);
                    this.model.set(fields);
                }, this);

                // listen to all dependent fields and update attribute value
                _.each(field.depends, function (name) {
                    this.model.on('change:' + name, updateComputedFieldValue);
                }, this);

                // listen to computed field change and update dependent fields
                this.model.on('change:' + fieldName, updateDependentFieldsValue);

                updateComputedFieldValue();
            }, this);
        },

        _computeFieldValue: function (computedField) {
            if (computedField && computedField.get) {
                var fields = this._dependentFields(computedField.depends);
                return computedField.get.call(this.model, fields);
            }
        },

        _dependentFields: function (depends) {
            return _.reduce(depends, function (memo, field) {
                memo[field] = this.model.attributes[field];
                return memo;
            }, {}, this);
        }

    });

    Backbone.ComputedFields = ComputedFields;

})();