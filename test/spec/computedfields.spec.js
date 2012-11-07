describe('Backbone.ComputedFields spec', function() {

    describe('when ComputedFields initialized in Backbone.Model', function () {

        var model;

        beforeEach(function () {
            var Model = Backbone.Model.extend({
                initialize: function () {
                    this.computedFields = new Backbone.ComputedFields(this);
                },

                grossPrice: {
                    get: function () {
                        return 100;
                    }
                }
            });

            model = new Model({ netPrice: 100, vatRate: 5});
        });

        it ('should be initialized', function () {
            expect(model.computedFields).to.exist;
            expect(model.computedFields._computedFields.length).to.equal(1);
        });

        it ('should access model attributes', function () {
            expect(model.get('netPrice')).to.equal(100);
            expect(model.get('vatRate')).to.equal(5);
        });

    });

    describe('when ComputedFields are used', function () {
        beforeEach(function () {
            var Model = Backbone.Model.extend({
                defaults: {
                    'netPrice': 0.0,
                    'vatRate': 0.0
                },

                initialize: function () {
                    this.computedFields = new Backbone.ComputedFields(this);
                },

                grossPrice: {
                    get: function () {
                        return 105;
                    }
                }
            });

            model = new Model({ netPrice: 100, vatRate: 5});
        });

        it ('should calculate grossPrice', function () {
            expect(model.get('grossPrice')).to.equal(105);
        });

    });

    describe('when dependent fields are used', function () {
        beforeEach(function () {
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
        });

        it ('should used dependent fields for calculation', function () {
            expect(model.get('grossPrice')).to.equal(120);
        });
    });


    // describe('when Backbone.Model is extened with ComputedFields', function () {

    //     var model;

    //     beforeEach(function () {
    //         var Model = Backbone.ComputedFields({
    //             defaults: {
    //                 'netPrice': 0.0
    //             }
    //         });

    //         model = new Model();
    //     });

    //     it ('should plain attributes be accessible as before', function () {
    //         expect(model.get('netPrice')).to.equal(0.0);
    //     });

    //     it ('should give undefined for attributes which does not exist', function () {
    //         expect(model.get('some')).to.not.exist;
    //     });


        // describe('when computed fields are used', function () {

        //     describe('getting values from computed fields', function () {

        //         beforeEach(function () {

        //             var Model = Backbone.ComputedFields(Backbone.Model, {
        //                 defaults: {
        //                     'netPrice': 0.0,
        //                     'vatRate': 5
        //                 },

        //                 initialize: function () {
        //                     this.computedField(this.grossPrice);
        //                 },

        //                 grossPrice: {
        //                     depends: ['netPrice', 'vatRate'],
        //                     get: function (depends) {
        //                         return depends.netPrice * (1 + 1 / depends.vatRate);
        //                     }
        //                 }
        //             });

        //             model = new Model({ netPrice: 100 });
        //         });

        //         it ('should get value of computed field', function () {
        //             expect(model.get('grossPrice')).to.equal(105);
        //         });
        //     });

        // });

    // });

});
