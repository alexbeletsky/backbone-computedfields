#Backbone.ComputedFields [![Build Status](https://secure.travis-ci.org/alexanderbeletsky/backbone.computedfields.png?branch=master)](https://travis-ci.org/alexanderbeletsky/backbone.computedfields)

Inspired by Derik Bailey's [Backbone.Computed](https://github.com/derickbailey/backbone.compute), Backbone.ComputedFields aims the same idea, but polished for real project needs.

##Quick start

Instantiated in `initialize` method,

```js
initialize: function () {
    this.computedFields = new Backbone.ComputedFields(this);
},
```

ComputedField is declared as `computed` in model,

```js
computed: {
    
}
```

All properties inside are treated as computed fields.

```js
computed: {
    grossPrice: {
        get: function () {
            return 105;
        }
    }
}
```

Each property that declares `get` or `set` method is treated as computed.

Get the value of computed property, 

```js
model.get('grossPrice');    // -> 105 is returned
```

##Dependent fields

In case that computed field depends on some other models fields,

```js
computed: {
    grossPrice: {
        depends: ['netPrice', 'vatRate'],
        get: function (fields) {
            return fields.netPrice * (1 + fields.vatRate / 100);
        }
    }
}
```

Add `depends` object into computed field object, as array of dependent fields. Dependent fields are injected into correspoding `get` method, by passing initialized `fields` object inside,

```js
var Model = Backbone.Model.extend({
    defaults: {
        'netPrice': 0.0,
        'vatRate': 0.0
    },

    initialize: function () {
        this.computedFields = new Backbone.ComputedFields(this);
    },

    computed: {
        grossPrice: {
            depends: ['netPrice', 'vatRate'],
            get: function (fields) {
                return fields.netPrice * (1 + fields.vatRate / 100);
            }
        }
    }
});

model = new Model({ netPrice: 100, vatRate: 20});
model.get('grossPrice')     // -> 120 is returned
```

##Setting computed values

Besides of `get` computed field might have `set` method as well. 

```js
computed: {
    grossPrice: {
        depends: ['netPrice', 'vatRate'],
        get: function (fields) {
            return fields.netPrice * (1 + fields.vatRate / 100);
        },
        set: function (value, fields) {
            fields.netPrice = value / (1 + fields.vatRate / 100);
        }
    }
}
```

`set` function recieves the `fields` object, with same names of properties as model attributes. If `set` function changes the value of property, the change is propogated to model. Typically, you should change only one field in `set` method.

##Model changes

In case of depended field is changed, computed field is automatically updated

```js
model.set({vatRate: 5});
model.get('grossPrice');        // -> 105 is returned

// or

model.set({netPrice: 120});
model.get('grossPrice');        // -> 126 is returned
```

In case of calculated field is changed, dependent field in automatically updated

```js
model.set({grossPrice: 105});
model.get('netPrice');          // -> 100 is returned
```

##Model events

To make views works correctly, it important to keep correct events distribution.

In case of depended field is changed,

```js
model.set({netPrice: 120});
```

After that call, several events are triggered - `change:netPrice`, as a reaction of `grossPrice` updated, `change:grossPrice` is triggered.

In case of computed field is changed,

```js
model.set({grossPrice: 80});
```

After that call, several events are triggered - `change:grossPrice`, as a reaction of `netPrice` updated, `change:netPrice` is triggered.

##Model validation

The same rules as for usual Backbone.js model attributes rules are applied for computed ones. If model contains `validate()` method and invalid is being set, the change would not propagate into model attributes, `error` event is triggered instead.

Say, we have such validation function,

```js
validate: function (attrs) {

    var errors = [];
    if (!_.isNumber(attrs.netPrice) || attrs.netPrice < 0) {
        errors.push('netPrice is invalid');
    }

    if (!_.isNumber(attrs.grossPrice) || attrs.grossPrice < 0) {
        errors.push('grossPrice is invalid');
    }

    return errors.length > 0 ? errors : false;
}
```

And change computed field,

```js
model.set({grossPrice: ''});
```

The model is will remain in valid state, `{ netPrice: 100, vatRate: 20, grossPrice: 120 }`.

##Dependency function

Computed field might have dependency not only on internal model attributes, but on external objects too. For instance, the product show price depends on currency selected by user in currency widget. Besides properties names, `depends: []` can accept function, that is responsible to fire callback if change occured.

```js
computed: {
    grossPrice: {
        depends: ['netPrice', 'vatRate', function (callback) {
            this.external.on('change:value', callback);
        }],
        get: function (fields) {
            return this.external.get('value');
        }
    }
}
```

##JSON payload

By default all computed fields are treated as part of JSON payload,

```js
model.toJSON()          // -> { "netPrice": 100, "grossPrice": 120, "vatRate": 20 };
```

To disable that add `toJSON: false` in computed field declaration,

```js
computed: {
    grossPrice: {
        depends: ['netPrice', 'vatRate'],
        get: function (fields) {
            return fields.netPrice * (1 + fields.vatRate / 100);
        },
        set: function (value, fields) {
            fields.netPrice = value / (1 + fields.vatRate / 100);
        },
        toJSON: false
    }
}
```

If you'd like to force the computed fields into the JSON payload even if the `toJSON` option is `false`, pass 
`computedFields: true` to the `toJSON` function:

```js
model.toJSON({ computedFields: true })
```

##More details

Up-to-date and complete documentation is located at [/test/spec/backbone.computedfields.spec.js](https://github.com/alexanderbeletsky/backbone.computedfields/blob/master/test/spec/backbone.computedfields.spec.js).

## Versions / Changes

### v.0.0.5 17 February, 2013

* AMD support added

### v.0.0.4 26 December, 2012

* Support for Backbone 0.9.9
* Removed 'silent' updates, since it's not supported in 0.9.9

### v.0.0.3 12 December, 2012

* Breaking change: computed fields are wrapped in `computed` object.
* Dependency on external object

### v.0.0.2 11 December, 2012

* Silent fields implemented
* Several bug fixes

### v.0.0.1 18 November, 2012

* Initial version: basic functions, events

# Legal Info (MIT License)

Copyright (c) 2012 Alexander Beletsky

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
