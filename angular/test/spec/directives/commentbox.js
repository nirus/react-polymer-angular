'use strict';

describe('Directive: commentbox', function() {

    // load the directive's module
    beforeEach(module('commentBox'));

    var element, scope, httpBackend;

    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        //Check the Elapsed time is being rendered properly
        var oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        httpBackend = $httpBackend;
        httpBackend.when('GET', 'http://localhost:2403/comments/').respond([{ author: 'Santiago', msg: 'Msg 1', id: 1, isoDateAndTime: oneHourAgo }]);
        scope = $rootScope.$new();
        element = angular.element('<comment-box url="http://localhost:2403/comments/" poll-interval="10000"></comment-box>');
        element = $compile(element)(scope);

    }));

    describe('once it is rendered', function() {

        it('should make an http request based on passed url', function() {
            httpBackend.expectGET('http://localhost:2403/comments/');            
            scope.$digest();
            httpBackend.flush();
        });

        it('should set state', function() {
            scope.$digest();
            httpBackend.flush();            
            var isolatedScope = element.isolateScope();
            expect(isolatedScope.data).toEqual([{ author: 'Santiago', msg: 'Msg 1', id: 1, timeElapsed: "1 hours ago", isoDateAndTime: jasmine.any(Date), $$hashKey: jasmine.any(String) }])
        });

        it('should render a comment with elapsed time as 1 hour ago', function() {
            scope.$digest();
            httpBackend.flush();            
            var commentModel = angular.element(element.find('comment-model')[0]);
            expect(commentModel.find("span").text()).toEqual("Msg 1 : 1 hours ago");
        });

        it('should render a CommentList', function() {            
            expect(element.find('comment-list')).toBeDefined();
        });

        it('should render a CommentForm', function() {
            expect(element.find('comment-form')).toBeDefined();
        });

    });
});
