// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:

const stylesArray = [
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

var rackLocation;
//Grab rack locations for variable rackLocation
getRacks();
var test = [
    ['Tremont Athletic East', 41.508821, -81.602177, 'A'],
    ['Washkewicz School of Engineering', 41.503503, -81.673287, 'B'],
    ['Climb Cleveland', 41.482013, -81.687308, 'C'],
    ['Sherwin Williams HQ', 41.496804, -81.692058, 'D']
];

var userPos = { lat: 41.499321, lng: -81.694359 };


function initAutocomplete() {

    //Needs to be inside this function
    const markerSize = new google.maps.Size(50, 50);
    const markerURL = 'src/Images/number_';
    var icons = {
        user: {
            url: 'src/Images/cycling.png',
            scaledSize: markerSize
        },
        numbers: {
            url: markerURL,
            scaledSize: markerSize
        },
        search: {
            url: 'src/Images/pin.png',
            scaledSize: markerSize
        }
    };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        mapTypeId: 'roadmap',
        disableDefaultUI: 'true'
    });

    const currentLocation = new google.maps.Marker({
        map: map,
        icon: icons.user,
        title: 'Your location'
    });

    let prevMarker = currentLocation;

    const bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);
    map.setOptions({styles: stylesArray});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            userPos.lat = position.coords.latitude;
            userPos.lng = position.coords.longitude;

            currentLocation.setPosition(userPos);
            map.setCenter(userPos);
        }, () => {
            //If location services denied
            currentLocation.setPosition(userPos);
            map.setCenter(userPos);
        });
    }
    else {
        // Browser doesn't support Geolocation
        currentLocation.setPosition(userPos);
        map.setCenter(userPos);
    }

    // document.getElementsByClassName('nearest_lock')[0].onclick = () => {
    //     nearestLock(currentLocation.position);
    // };

    //Puts user marker on map
    currentLocation.addListener('click', () => {
        banner([currentLocation.title, null]);
        map.panTo(currentLocation.position);
        setTimeout(toggleBounce, 500, prevMarker, currentLocation);
        prevMarker = currentLocation;
    });
    //Bug prevents us from using any map movement with other animations

    rackLocation.forEach(rack => {
        alert(rack[3]);
        // alert(availableLocks[rack[3][0]]);
        icons.numbers.url += availableLocks[rack[3]][0] + '.png';
        let marker = new google.maps.Marker({
            position: {lat: parseFloat(rack[1]), lng: parseFloat(rack[2])},
            map: map,
            // icon: icons.numbers,
            title: rack[0]
        });

        //Passes the specific rack to display necessary data, location, num locks
        marker.addListener('click', () => {
            banner(rack);
            map.panTo(marker.position);
            setTimeout(toggleBounce, 500, prevMarker, marker);
            prevMarker = marker;
        });
        icons.numbers.url = markerURL;
    });

    // Create the search box and link it to the UI element.
    let input = document.getElementsByClassName('pac-input')[0];
    let searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(input);

    let prevSearch;

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    searchBox.addListener('places_changed', function() {

        var places = searchBox.getPlaces();

        places.forEach(function(place) {
            // Create a marker for each place.
            let markers = new google.maps.Marker({
                map: map,
                icon: icons.search,
                title: place.name,
                position: place.geometry.location
            });

            prevSearch ? prevSearch.setMap(null) : null;
            prevSearch = markers;

            map.panTo(markers.getPosition());
        });
    });
}

function getRacks() {
    xmlhttpGET = window.XMLHttpRequest ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttpGET.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            rackLocation = JSON.parse(this.responseText);
        }
    };

    xmlhttpGET.open("GET", "src/PHP/racks.php?", true);
    xmlhttpGET.send();

}
