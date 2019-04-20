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
    ['Tremont Athletic East', 41.508821, -81.602177, 'A'],
    ['Washkewicz School of Engineering', 41.503503, -81.673287, 'B'],
    ['Climb Cleveland', 41.482013, -81.687308, 'C'],
    ['Sherwin Williams HQ', 41.496804, -81.692058, 'D']
];



function initAutocomplete() {
    //Needs to be inside this function
    var markerSize = new google.maps.Size(50, 50);
    var markerURL = 'src/Images/number_';
    var icons = {
        user: {
            url: 'src/Images/user.png',
            scaledSize: markerSize
        },
        numbers: {
            url: markerURL,
            scaledSize: markerSize
        }
    };

    let defaultPos = { lat: 41.499321, lng: -81.694359 };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        mapTypeId: 'roadmap',
        disableDefaultUI: 'true'
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            let currentLocation = new google.maps.Marker({
                map: map,
                icon: icons.user,
                title: 'Your location'
            });

            //Puts user marker on map
            currentLocation.addListener('click', () => {
                banner(currentLocation);
            });
            currentLocation.setPosition(userPos);
            map.setCenter(userPos);
        }, () => {
            map.setCenter(defaultPos);
        });
    }
    else {
        // Browser doesn't support Geolocation
        map.setCenter(defaultPos);
    }

    const bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    map.setOptions({styles: stylesArray});

    var previousRack;

    rackLocation.forEach(rack => {
        icons.numbers.url += availableLocks[rack[3]][0] + '.png';
        let marker = new google.maps.Marker({
            position: {lat: rack[1], lng: rack[2]},
            map: map,
            icon: icons.numbers,
            title: rack[0]
        });

        //Passes the specific rack to display necessary data, location, num locks
        marker.addListener('click', () => {
            banner(rack);
            previousRack = rack.title;
        });
        icons.numbers.url = markerURL;
    });


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