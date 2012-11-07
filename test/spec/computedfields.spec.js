describe('Give it some context', function() {
    describe('maybe a bit more context here', function() {

        it('should run here few assertions', function() {
            expect(0).to.equal(1);
        });

        it ('should fail some', function () {
            expect(0).be(100);
        });

    });
});
