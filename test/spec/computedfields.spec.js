describe('Backbone.ComputedFields spec', function() {

    describe('when Backbone.ComputedFields is constructing', function () {

        var computedFields;

        beforeEach(function () {
            computedFields = new Backbone.ComputedFields();
        });

        it ('should exist', function () {
            expect(computedFields).to.exist;
        });

    });

});
