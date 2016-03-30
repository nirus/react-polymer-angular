'use strict';

/**
 * @ngdoc directive
 * @name angularApp.directive:commentList
 * @description
 * # commentList
 */
angular.module('commentList', ['comment'])
  .directive('commentList', function () {
    return {
      template: '<div class="commentList">' +
                  '<comment-model ng-repeat="comment in comments" author="{{comment.author}}">' +
                    '{{comment.msg}}' +" : "+ '{{comment.timeElapsed}}' +
                  '</comment-model>' +
                  '<span ng-if="comments.length < 1">No comments yet</span>' +
                '</div>',
      restrict: 'E',
      scope: {
        comments: '='
      },
      link: function postLink(scope, element, attrs) {}
    };
  });
