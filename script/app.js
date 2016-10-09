(function() {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.constant('API_URL', "https://davids-restaurant.herokuapp.com")
	.controller('NarrowItDownDirectiveController', [function() {
		var dirCtrl = this;

			dirCtrl.itemsInMenu = function() {
				return dirCtrl.found.length > 0;
			}
	}])
	.directive('foundItems', function() {
		return {
			templateUrl: 'foundItems.html',
			controller: 'NarrowItDownDirectiveController',
			controllerAs: 'dirCtrl',
			bindToController: true,
			scope: {
				found: '<foundItemsList',
				onRemove: '&'
			}
		};
	})
	.service('MenuSearchService', ['$http', 'API_URL', function($http, API_URL) {
		var service = this;
		
		service.getMatchedMenuItems = function(searchTerm) {
			return $http({
				method: 'GET',
				url: API_URL + '/menu_items.json'
			}).then(function (response) {
				var data = response.data;
			    var foundItems = [];

			    for(var i in data.menu_items) {
			    	var menuItem = data.menu_items[i];
			    	if(menuItem.description.toLowerCase().indexOf(searchTerm) >= 0 
			    		|| menuItem.name.toLowerCase().indexOf(searchTerm) >= 0) 
			    	{
			    		foundItems.push(menuItem);
			    	}
			    }

			    // return processed items			    
			    return foundItems;
			});
		}

	}])
	.controller('NarrowItDownController', ['$scope', 'MenuSearchService', function($scope, $service) {
		var ctrl = this;
		
		ctrl.searchTerm = '';

		ctrl.narrowBtnClick = function() {
			$service.getMatchedMenuItems(ctrl.searchTerm)
			.then(function(result) {
				ctrl.found = result;
			});
		};

		ctrl.removeFoundItem = function(index) {
			ctrl.found.splice(index, 1);
		}
	}]);

}) ();