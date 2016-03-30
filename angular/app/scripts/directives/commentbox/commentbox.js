'use strict';

/**
 * @ngdoc directive
 * @name angularApp.directive:commentBox
 * @description
 * # commentBox
 */
angular.module('commentBox', ['commentList', 'commentForm'])
  .directive('commentBox', function ($http) {
    return {
      template: '<div class="commentBox">' +
                  '<h1>Comments</h1>' +
                  '<comment-list comments="data"></comment-list>' +
                  '<comment-form></comment-form>' +
                '</div>',
      restrict: 'E',
      scope: {
        url: '@',
        pollInterval: '@'
      },
      link: function postLink(scope, element, attrs) {
          
        var calculateTime = function(oldtime, newtime){
            var min = 60*1000, hrs = min*60, day = hrs*24, month = day * 30,           
                timediff = newtime - oldtime;            
            
            if(oldtime > newtime){
                 return "Invalid timestamp entry.";
            }else if (timediff < min) {
                return "1 Min Ago";   
            }else if (timediff < hrs) {
                return Math.round(timediff/min) + ' minutes ago';   
            }else if (timediff < day) {
                return Math.round(timediff/hrs) + ' hours ago';   
            }else if(timediff < month){
                return Math.round(timediff/day) + ' days ago';
            }else{
                return "More than a Month ago";
            }     
        }; 
        
        var loadCommentsFromServer = function () {
          $http.get(scope.url)
            .success(function(data, status, headers, config){
              data.forEach(function(el, index, arr){                  
                  arr[index].timeElapsed = calculateTime(new Date(el.isoDateAndTime), new Date());                  
              });                 
              scope.data = data;
            })
            .error(function(data, status, headers, config){
              console.log(status);
            });
        };
        
        var handleCommentSubmit = function (event, data) {
          var comment = data;
          scope.data.concat([comment]);
          $http.post(scope.url, comment)
            .success(function(data, status, headers, config){
              console.log('success')
            })
            .error(function(data, status, headers, config){
              console.log(status);
            });
        };
        loadCommentsFromServer();
        setInterval(loadCommentsFromServer, scope.pollInterval);
        scope.$on('submitted', handleCommentSubmit);        
      }
  }});
