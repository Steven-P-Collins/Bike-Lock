//Turns banner on and off for displaying buttons to lock and such

banner = function (location) {
    let banner = document.getElementsByClassName('banner')[0];

    closeBanner(banner, location[0]);

    location[0] !== 'Your location' ? lockMarker(banner, location) :
        userMarker(banner, location[0]);

};

userMarker = function (banner, title) {
    banner.id = title;
    buttonDisplay(3);
};

lockMarker = function  (banner, title) {
    banner.id = title[0];

    if (availableLocks[title[3]][0] === 0) {
        buttonDisplay(0);
    }
    else if (!bleDevice || !bleDevice.gatt.connected) {
        buttonDisplay(1);
    }
    else if (bleDevice.gatt.connected) {
        buttonDisplay(2);
    }
};

//Allows us to set styling based on a numerical choice of 0, 1, or 2
buttonDisplay = function (choice) {
    let connectButton = document.getElementsByClassName('connect')[0].style;
    let disconnectButton = document.getElementsByClassName('disconnect')[0].style;
    let lockButton = document.getElementsByClassName('lock')[0];
    let tutorial = document.getElementsByClassName('tutorial')[0].style;
    let noLocks = document.getElementsByClassName('no_locks')[0].style;

    if (choice === 0) {
        lockButton.style.display = 'none';
        connectButton.display = 'none';
        disconnectButton.display = 'none';
        tutorial.display = 'none';
        // noLocks.display = 'block';
    }
    else if (choice === 1) {
        lockButton.innerHTML = 'Lock';
        lockButton.style.display = 'none';
        connectButton.display = 'block';
        disconnectButton.display = 'none';
        tutorial.display = 'none';
        noLocks.display = 'none';
    }
    else if (choice === 2) {
        lockButton.style.display = 'inline-block';
        connectButton.display = 'none';
        disconnectButton.display = 'inline-block';
        tutorial.display = 'none';
        noLocks.display = 'none';
    }
    else {
        lockButton.style.display = 'none';
        connectButton.display = 'none';
        disconnectButton.display = 'none';
        tutorial.display = 'block';
        noLocks.display = 'none';
    }
};

closeBanner = function (banner, title) {
    if (banner.style.display !== 'block') {
        banner.style.display = 'block';
    }
    else if (title === banner.id) {
        banner.style.display = 'none';
    }
};

toggleBounce = function (prevMarker, marker) {
    if (prevMarker !== marker) {
        prevMarker.setAnimation(null);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    else if (prevMarker === marker && !prevMarker.getAnimation()) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    else {
        marker.setAnimation(null);
    }
};

// nearestLock = function () {
//
// };