describe('Game list item directive', function() {
    'use strict';

    var el,
        compile,
        scope,
        mockVariantService,
        mockGameService,
        httpBackend,
        provide;

    beforeEach(function() {
        angular.mock.module('templates');
        angular.mock.module('ui.router');
        angular.mock.module('gamelistitem.component');

        mockVariantService = {
            getVariant: function() {
                return {
                };
            }
        };
        mockGameService = {
            getPhases: sinon.stub().returnsPromise().resolves({ Properties: [] }),
            isPlayer: function() { return false; }
        };

        angular.mock.module('gameService', function($provide) {
            provide = $provide;
            provide.value('gameService', mockGameService);
            provide.value('variantService', mockVariantService);
        });
    });

    beforeEach(function() {
        inject(function($injector, $compile, $rootScope, $httpBackend) {
            scope = $rootScope;
            compile = $compile;
            httpBackend = $httpBackend;

            // Icon fetches are to be expected.
            httpBackend.whenGET(/\/icons\//).respond(200);

            scope.game = {
                Properties: {
                    Desc: 'Test Game',
                    Variant: 'Classical',
                    Members: [ { }, { } ],
                    Started: true
                }
            };
            scope.variant = { name: 'Standard' };
        });
    });

    it('displays the name', function() {
        el = compile('<sg-game-list-item game="game" joinable="false"></sg-game-list-item>')(scope);
        scope.$digest();
        expect($('h1.md-title', el)).to.have.text('Test Game');
    });

    describe('\'Join\' button', function() {
        it('displays the button according to state of \'joinable\' flag', function() {
            // PART I: joinable = true.
            el = compile('<sg-game-list-item game="game" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#joinButton', el)).to.have.lengthOf(1);

            // PART II: joinable = false.
            el = compile('<sg-game-list-item game="game" joinable="false"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('#joinButton', el)).to.have.lengthOf(0);
        });

        it('is disabled if player is in game already', function() {
            mockGameService.isPlayer = function() { return true; };
            provide.value('gameService', mockGameService);

            el = compile('<sg-game-list-item game="game" joinable="true"></sg-game-list-item>')(scope);
            scope.$digest();
            expect($('button', el)).to.be.disabled;
        });
    });
});
