// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:

var stylesArray = [
    {
        featureType: 'all',
        stylers: [
            {visibility: 'off'}
        ]
    },
    {
        featureType: 'road',
        stylers: [
            {visibility: 'on'}
        ]
    },
    {
        featureType: 'landscape',
        stylers: [
            {visibility: 'on'}
        ]
    },
    {
        featureType: 'water',
        stylers: [
            {visibility: 'on'}
        ]
    },
    {
        featureType: 'poi.park',
        stylers: [
            {visibility: 'on'}
        ]
    }
];

var rackLocation = [
    ['Tremont Athletic East', 41.508821, -81.602177],
    ['Washkewicz School of Engineering', 41.503503, -81.673287],
    ['Climb Cleveland', 41.482013, -81.687308],
    ['Sherwin Williams HQ', 41.496804, -81.692058]
];

function test () {
    alert('hey!');
}

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.499321, lng: -81.694359},
        zoom: 17,
        mapTypeId: 'roadmap',
        disableDefaultUI: 'true'
    });

    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    map.setOptions({styles: stylesArray});

    let infowindow = new google.maps.InfoWindow();

    rackLocation.forEach(rack => {
        let marker = new google.maps.Marker({
            position: {lat: rack[1], lng: rack[2]},
            map: map,
            title: rack[0]
        });

        marker.addListener('click', function() {
            infowindow.setContent('<button onclick=test() }></button>');
            infowindow.open(map, marker);
        });
    });

    // var marker = new google.maps.Marker({
    //     rackLocation
    // });
    // marker.setMap(map);

    // Create the search box and link it to the UI element.
    var input = document.getElementsByClassName('pac-input')[0];
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}