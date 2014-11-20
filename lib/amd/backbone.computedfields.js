// Backbone.ComputedFields, v0.0.9
// Copyright (c)2014 alexander.beletsky@gmail.com
// Distributed under MIT license
// https://github.com/alexanderbeletsky/backbone-computedfields

(function (root, factory) {
  if (typeof exports === 'object') {

    var underscore = require('underscore');
    var backbone = require('backbone');

    module.exports = factory(underscore, backbone);

  } else if (typeof define === 'function' && define.amd) {

    define(['underscore', 'backbone'], factory);

  } 
}(this, function (_, Backbone) {

  Backbone.ComputedFields = (function(Backbone, _){
  
      var ComputedFields = function (model) {
          this.model = model;
          this._computedFields = [];
  
          this.initialize();
      };
  
      _.extend(ComputedFields.prototype, {
          initialize: function () {
              _.bindAll(
                  this,
                  '_bindModelEvents',
                  '_computeFieldValue',
                  '_dependentFields',
                  '_isModelInitialized',
                  '_lookUpComputedFields',
                  '_thenComputedChanges',
                  '_thenDependentChanges',
                  '_toJSON',
                  '_wrapJSON',
                  'initialize'
              );
  
              this._lookUpComputedFields();
              this._bindModelEvents();
              this._wrapJSON();
          },
  
          _lookUpComputedFields: function () {
              for (var obj in this.model.computed) {
                  var field = this.model.computed[obj];
  
                  if (field && (field.set || field.get)) {
                      this._computedFields.push({name: obj, field: field});
                  }
              }
          },
  
          _bindModelEvents: function () {
              _.each(this._computedFields, function (computedField) {
                  var fieldName = computedField.name;
                  var field = computedField.field;
  
                  var updateComputed = _.bind(function () {
                      var value = this._computeFieldValue(field);
                      this.model.set(fieldName, value, { skipChangeEvent: true });
                  }, this);
  
                  var updateDependent = _.bind(function (model, value, options) {
                      if (options && options.skipChangeEvent) {
                          return;
                      }
  
                      if (field.set) {
                          var fields = this._dependentFields(field.depends);
                          value = value || this.model.get(fieldName);
  
                          field.set.call(this.model, value, fields);
                          this.model.set(fields, options);
                      }
                  }, this);
  
                  this._thenDependentChanges(field.depends, updateComputed);
                  this._thenComputedChanges(fieldName, updateDependent);
  
                  if (this._isModelInitialized()) {
                      updateComputed();
                  }
              }, this);
          },
  
          _isModelInitialized: function () {
              return !_.isEmpty(this.model.attributes);
          },
  
          _thenDependentChanges: function (depends, callback) {
              _.each(depends, function (name) {
                  if (typeof (name) === 'string') {
                      this.model.on('change:' + name, callback);
                  }
  
                  if (typeof (name) === 'function') {
                      name.call(this.model, callback);
                  }
              }, this);
          },
  
          _thenComputedChanges: function (fieldName, callback) {
              this.model.on('change:' + fieldName, callback);
          },
  
          _wrapJSON: function () {
              this.model.toJSON = _.wrap(this.model.toJSON, this._toJSON);
          },
  
          _toJSON: function (toJSON) {
              var args = Array.prototype.slice.call(arguments, 1),
                  attributes = toJSON.apply(this.model, args),
                  strip = !!(args[0] || {}).computedFields;
  
              var stripped = strip ? {} : _.reduce(this._computedFields, function (memo, computed) {
                  if (computed.field.toJSON === false) {
                      memo.push(computed.name);
                  }
                  return memo;
              },[]);
  
              return _.omit(attributes, stripped);
          },
  
          _computeFieldValue: function (computedField) {
              if (computedField && computedField.get) {
                  var fields = this._dependentFields(computedField.depends);
                  return computedField.get.call(this.model, fields);
              }
          },
  
          _dependentFields: function (depends) {
              return _.reduce(depends, function (memo, field) {
                  memo[field] = this.model.get(field);
                  return memo;
              }, {}, this);
          }
  
      });
  
      return ComputedFields;
  
  })(Backbone, _);
  return Backbone.ComputedFields; 

}));
