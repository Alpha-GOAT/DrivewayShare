app.controller("UserController", function($scope, Nav, $window, Listings){

  $scope.data = {};
  $scope.editedData = [];
  $scope.tab = 1;

  Nav.setPage(3);

  var resetNewListing = function() {
    $scope.newListing = {
      formatted_address: "",
      price: "",
      descrip: ""
    }
  };

  resetNewListing();

  $scope.autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById("post-address-input")),
    {types: ["geocode"]});

  // Manages createListing view vs manageListing view
  $scope.setTab = function(tab) {
    $scope.tab = tab;
  };

  $scope.isSet = function(tab) {
    return $scope.tab === tab;
  };

  $scope.toggleExpand = function(item) {
    item.expand = !item.expand;
  };


  $scope.createListing = function() {
    Listings.sendAddress("post-address-input", function(results) {
      results.price = $scope.newListing.price;
      results.descrip = $scope.newListing.descrip;

      Listings.postListing(results).then(function(respdata) {
        resetNewListing();
        getCurrentListings();
      });
    });
  };

  $scope.removeListing = function(item) {
    var index = $scope.data.indexOf(item);
    var id = $scope.data[index].id;

    $scope.data.splice(index, 1);
    Listings.deleteListing(id);
  };

  $scope.toggleListingAvailability = function(item) {
    var index = $scope.data.indexOf(item);
    var id = $scope.data[index].id;
    // Database stores availability as 1 (true) or 0 (false)
    // Converts before sending back to server
    var avail = $scope.data[index].available ? 1 : 0;

    Listings.toggleListingAvailability(id, avail);
  };

  var getCurrentListings = function() {
    Listings.getUserListings().then(function(searchResult) {
      $scope.data = searchResult;
    })
  }

  getCurrentListings();
});
