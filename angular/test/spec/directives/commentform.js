'use strict';

describe('Directive: commentForm', function () {

  // load the directive's module
  beforeEach(module('commentForm'));

  var element, scope, compile, form;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
    spyOn(scope, '$emit');
    element = angular.element('<comment-form></comment-form>');
    element = compile(element)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should submit the form when user enters msg and author', function (){
    form.author.$setViewValue('Santiago');
    form.msg.$setViewValue('Msg 1');
    element.find('input')[2].click();        
    expect(scope.$emit).toHaveBeenCalledWith('submitted', { author: 'Santiago', msg: 'Msg 1', isoDateAndTime:jasmine.any(Date)} );
  });

  it('should not submit the form if msg or author fields are empty', function (){
    element.find('input')[2].click();
    expect(scope.$emit).not.toHaveBeenCalled();
  });

  it('should clear all inputs after submitting the form', function(){
    form.author.$setViewValue('Santiago');
    form.msg.$setViewValue('Msg 1');
    element.find('input')[2].click();
    expect(element.find('input')[0].value).toBe('');
    expect(element.find('input')[1].value).toBe('');
  });

});
