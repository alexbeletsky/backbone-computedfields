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


    describe('when dependent field is changed', function () {
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

        describe('vatRate changed', function () {

            beforeEach(function () {
                model.set({vatRate: 5});
            });

            it ('should calculate field value updated', function () {
                expect(model.get('grossPrice')).to.equal(105);
            });

            it ('dependent field remains the same', function () {
                expect(model.get('netPrice')).to.equal(100);
            });

        });

        describe('netPrice changed', function () {

            beforeEach(function () {
                model.set({netPrice: 200});
            });

            it ('should calculate field value updated', function () {
                expect(model.get('grossPrice')).to.equal(240);
            });

            it ('dependent field remains the same', function () {
                expect(model.get('vatRate')).to.equal(20);
            });

        });

    });

    describe('when calculated field is changed', function () {
        var triggerMethodSpy;

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
                    },
                    set: function (value, fields) {
                        fields.netPrice = value / (1 + fields.vatRate / 100);
                    }
                }
            });

            model = new Model({ netPrice: 100, vatRate: 20});
            triggerMethodSpy = sinon.spy(model, 'trigger');

            model.set({ grossPrice: 80 });
        });

        it ('should updated dependent field', function () {
            expect(model.get('netPrice')).to.equal(80 / (1 + 20 / 100));
        });

        it ('should change:grossPrice triggered', function () {
            expect(triggerMethodSpy.calledWith('change:grossPrice')).to.be.true;
        });

        it ('should change:netPrice triggered', function () {
            expect(triggerMethodSpy.calledWith('change:netPrice')).to.be.true;
        });

        it ('should change:vatRate not triggered, since field not changed', function () {
            expect(triggerMethodSpy.calledWith('change:vatRate')).to.be.false;
        });

    });


});
