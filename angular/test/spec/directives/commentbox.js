'use strict';

describe('Directive: commentbox', function() {

    // load the directive's module
    beforeEach(module('commentBox'));

    var element, scope, httpBackend, isoTimestamp = [], i=0;
    
    /*Elapsed Time Conditions;*/   
    
    //Invalid time entry
    isoTimestamp.push((function(){
         var invalidTime = new Date();
        invalidTime.setHours(invalidTime.getHours() + 1);
        return invalidTime;
    })());
    
    //For 1 hour ago
    isoTimestamp.push((function(){
        var oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);        
        return oneHourAgo;
    })());
    
    //For 1 Min ago
    isoTimestamp.push((function(){
         var oneMinAgo = new Date();
        oneMinAgo.setMinutes(oneMinAgo.getMinutes(-57));
        return oneMinAgo;
    })());
    
    //One day ago
    isoTimestamp.push((function(){
         var oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours()-24);
        return oneDayAgo;
    })());
    
    //More than a month ago
    isoTimestamp.push((function(){
         var moreThanOneMonth = new Date();
        moreThanOneMonth.setMonth(moreThanOneMonth.getMonth() - 2);
        return moreThanOneMonth;
    })());
    
    beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        //Check the Elapsed time is being rendered properly
        
        httpBackend = $httpBackend;
        httpBackend.when('GET', 'http://localhost:2403/comments/').respond([{ author: 'Santiago', msg: 'Msg 1', id: 1, isoDateAndTime: isoTimestamp[i] }]);
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
            expect(isolatedScope.data).toEqual([{ author: 'Santiago', msg: 'Msg 1', id: 1, timeElapsed: jasmine.any(String), isoDateAndTime: jasmine.any(Date), $$hashKey: jasmine.any(String) }])
        });
        
        it('should render a comment with elapsed time Invalid timestamp entry.', function() {
            scope.$digest();
            httpBackend.flush();            
            var commentModel = angular.element(element.find('comment-model')[0]);
            expect(commentModel.find("span").text()).toEqual("Msg 1 : Invalid timestamp entry.");
            i++;
        });
        
        it('should render a comment with elapsed time as 1 hour ago', function() {
            scope.$digest();
            httpBackend.flush();            
            var commentModel = angular.element(element.find('comment-model')[0]);
            expect(commentModel.find("span").text()).toEqual("Msg 1 : 1 hours ago");
            i++;
        });
        
        it('should render a comment with elapsed time as 1 min ago', function() {
            scope.$digest();
            httpBackend.flush();            
            var commentModel = angular.element(element.find('comment-model')[0]);
            expect(commentModel.find("span").text()).toEqual("Msg 1 : 1 Min Ago");
            i++;
        });
        
        it('should render a comment with elapsed time as 1 day ago', function() {
            scope.$digest();
            httpBackend.flush();            
            var commentModel = angular.element(element.find('comment-model')[0]);
            expect(commentModel.find("span").text()).toEqual("Msg 1 : 1 days ago");
            i++;
        });
        
        it('should render a comment with elapsed time as More than a Month ago', function() {
            scope.$digest();
            httpBackend.flush();            
            var commentModel = angular.element(element.find('comment-model')[0]);
            expect(commentModel.find("span").text()).toEqual("Msg 1 : More than a Month ago");
            //i++;
        });

        it('should render a CommentList', function() {            
            expect(element.find('comment-list')).toBeDefined();
        });

        it('should render a CommentForm', function() {
            expect(element.find('comment-form')).toBeDefined();
        });

    });
});
