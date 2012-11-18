#Backbone.ComputedFields

Inspired by Derik Bailey's [Backbone.Computed](https://github.com/derickbailey/backbone.compute), Backbone.ComputedFields aims the same idea, but polished for real project needs.

##Plugin goal

Simple implementation of computed (auto, virtual) fields for Backbone.Models, with respect to model state and events firing.

##Quick start

Instantiated in `initialize` method,

```js
initialize: function () {
    this.computedFields = new Backbone.ComputedFields(this);
},
```

ComputedField is declared as property of model,

```js
grossPrice: {
    get: function () {
        return 105;
    }
}
```

Each property that declares `get` or `set` method is treaded as computed.

Get the value of computed property, 

```js
model.get('grossPrice');    // -> 105 is returned
```

##Dependent fields

In case that computed field depends on some other models fields,

```js
grossPrice: {
    depends: ['netPrice', 'vatRate'],
    get: function (fields) {
        return fields.netPrice * (1 + fields.vatRate / 100);
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

    grossPrice: {
        depends: ['netPrice', 'vatRate'],
        get: function (fields) {
            return fields.netPrice * (1 + fields.vatRate / 100);
        }
    }
});

model = new Model({ netPrice: 100, vatRate: 20});
model.get('grossPrice')     // -> 120 is returned
```

##Setting computed values

Besides of `get` computed field might have `set` method as well. 

```js
grossPrice: {
    depends: ['netPrice', 'vatRate'],
    get: function (fields) {
        return fields.netPrice * (1 + fields.vatRate / 100);
    },
    set: function (value, fields) {
        fields.netPrice = value / (1 + fields.vatRate / 100);
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

##JSON payload

By default all computed fields are treated as part of JSON payload,

```js
model.toJSON()          // -> { "netPrice": 100, "grossPrice": 120, "vatRate": 20 };
```

To disable that add `toJSON: false` in computed field declaration,

```js
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
```

##More details

Up-to-date and complete documentation is located at [/test/spec/computedfields.spec.js](https://github.com/alexanderbeletsky/backbone.computedfields/blob/master/test/spec/computedfields.spec.js).

## Versions / Changes

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