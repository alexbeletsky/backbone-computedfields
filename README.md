#Backbone.ComputedFields - computed fields for Backbone.Model extension

Inspired by Derik Bailey's [Backbone.Computed](https://github.com/derickbailey/backbone.compute), Backbone.ComputedFields aims the same idea, but polished for real project needs.

##Plugin goal

Simple implementation of computed (auto, virtual) fields for Backbone.Models, with respect to model state and events firing.

##Samples

`Backbone.ComputedFields` is instantiated in `Backbone.Model` `initialize` method,

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

In case of depended field is changed,

```js
    model.set({vatRate: 5});
    model.get('grossPrice');        // -> 105 is returned
    mode.set({netPrice: 120});
    model.get('grossPrice');        // -> 126 is returned
```

In case of calculated field is changed, 

```js
    model.set({grossPrice: 105});
    model.get('netPrice');          // -> 100 is returned
```

##Model events

In case of depended field is changed,

```js
    mode.set({netPrice: 120});
```

After that call, several events are triggered - `change:netPrice`, as a reaction of `grossPrice` updated, `change:grossPrice` is triggered.

In case of computed field is changed,

```js
    model.set({grossPrice: 80});
```

After that call, several events are triggered - `change:grossPrice`, as a reaction of `netPrice` updated, `change:netPrice` is triggered.