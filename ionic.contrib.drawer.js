(function() {

'use strict';

/**
 * The ionic-contrib-frosted-glass is a fun frosted-glass effect
 * that can be used in iOS apps to give an iOS 7 frosted-glass effect
 * to any element.
 */
angular.module('ionic.contrib.drawer', ['ionic'])

.controller('drawerCtrl', ['$element', '$attrs', '$ionicGesture', '$document', function($element, $attr, $ionicGesture, $document) {
  var self = this;
  this.isOpen = false;
  var el = $element[0];
  var dragging = false;
  var startX, lastX, offsetX, newX;
  var side;
  // How far to drag before triggering
  var thresholdX = 15;
  // How far from edge before triggering
  var edgeX = 40;

  var LEFT = 0;
  var RIGHT = 1;

  var isTargetDrag = false;

  var width = $element[0].clientWidth;

  var enableAnimation = function() {
    $element.addClass('animate');
  };
  var disableAnimation = function() {
    $element.removeClass('animate');
  };

  // Check if this is on target or not
  var isTarget = function(el) {
    while(el) {
      if(el === $element[0]) {
        return true;
      }
      el = el.parentNode;
    }
  };

  var startDrag = function(e) {
    disableAnimation();

    dragging = true;
    offsetX = lastX - startX;
  };

  var startTargetDrag = function(e) {
    disableAnimation();

    dragging = true;
    isTargetDrag = true;
    offsetX = lastX - startX;

  };

  var doEndDrag = function(e) {
    startX = null;
    lastX = null;
    offsetX = null;
    isTargetDrag = false;

    if(!dragging) {
      return;
    }

    dragging = false;

  
    enableAnimation();

    ionic.requestAnimationFrame(function() {
      if(newX < (-width / 2)) {
        el.style.transform = el.style.webkitTransform = 'translate3d(' + -width + 'px, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0, 0)';
      }
    });
  };

  var doDrag = function(e) {
    if(e.defaultPrevented) {
      return;
    }

    if(!lastX) {
      startX = e.gesture.touches[0].pageX;
    }

    lastX = e.gesture.touches[0].pageX;

    if(!dragging) {

      // Dragged 15 pixels and finger is by edge
      if(Math.abs(lastX - startX) > thresholdX) {
        if(isTarget(e.target)) {
          startTargetDrag(e);
        } else if(startX < edgeX) {
          startDrag(e);
        } 
      }
    } else {
   
      newX = Math.min(0, (-width + (lastX - offsetX)));
      ionic.requestAnimationFrame(function() {
        el.style.transform = el.style.webkitTransform = 'translate3d(' + newX + 'px, 0, 0)';
      });

    }

    if(dragging) {
      e.gesture.srcEvent.preventDefault();
    }
  };

  side = $attr.side == 'left' ? LEFT : RIGHT;
 

  $ionicGesture.on('drag', function(e) {
    doDrag(e);
  }, $document);
  $ionicGesture.on('dragend', function(e) {
    doEndDrag(e);
  }, $document);


  this.close = function() {
    self.isOpen = false;
    enableAnimation();
    ionic.requestAnimationFrame(function() {
      if(side === LEFT) {
        el.style.transform = el.style.webkitTransform = 'translate3d(-100%, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(100%, 0, 0)';
      }
    });
  };

  this.open = function() {
    self.isOpen = true;
    enableAnimation();
    ionic.requestAnimationFrame(function() {
      if(side === LEFT) {
        el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
      } else {
        el.style.transform = el.style.webkitTransform = 'translate3d(0%, 0, 0)';
      }
    });
  };
}])

.directive('drawer', ['$rootScope', '$ionicGesture', function($rootScope, $ionicGesture) {
  return {
    restrict: 'E',
    controller: 'drawerCtrl',
    link: function($scope, $element, $attr, ctrl) {
      $element.addClass($attr.side);
      $scope.openDrawer = function() {
        ctrl.open();
      };
      $scope.closeDrawer = function() {
        ctrl.close();
      };
      $scope.toggleDrawer = function() {
          if(ctrl.isOpen) {
              ctrl.close();
          } else {
              ctrl.open();
          }
      };
    }
  }
}])

.directive('drawerClose', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $element) {
      $element.bind('click', function() {
        var drawerCtrl = $element.inheritedData('$drawerController');
        drawerCtrl.close();
      });
    }
  }
}]);

})();
