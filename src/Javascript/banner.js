//Turns banner on and off for displaying buttons to lock and such
let locking;


banner = function (location) {
    let banner = document.getElementsByClassName('banner')[0];

    closeBanner(banner, location[0]);

    location[0] !== 'Your location' ? lockMarker(banner, location) :
        userMarker(banner, location[0]);

};

userMarker = function (banner, title) {
    banner.id = title;
    //show tutorial
    buttonDisplay(3);
};

lockMarker = function  (banner, title) {
    banner.id = title[0];
    let lockCode = title[3] - 1;


    if (availableLocks[lockCode][0][6] === '0') {
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
        locking.style.display = 'none';
        lockButton.style.display = 'none';
        connectButton.display = 'none';
        disconnectButton.display = 'none';
        tutorial.display = 'none';
        noLocks.display = 'block';
    }
    else if (choice === 1) {
        lockButton.innerHTML = 'Lock';
        lockButton.style.display = 'none';
        connectButton.display = 'block';
        disconnectButton.display = 'none';
        tutorial.display = 'none';
        noLocks.display = 'none';
        locking.style.display = 'none';
    }
    else if (choice === 2) {
        locking.style.display = 'none';
        lockButton.style.display = 'inline-block';
        connectButton.display = 'none';
        disconnectButton.display = 'inline-block';
        tutorial.display = 'none';
        noLocks.display = 'none';
    }
    else if (choice === 3) {
        locking.style.display = 'none';
        lockButton.style.display = 'none';
        connectButton.display = 'none';
        disconnectButton.display = 'none';
        tutorial.display = 'none'; //Should be block
        noLocks.display = 'none';
    }
    else {
        lockingDisplay();
        lockButton.style.display = 'none';
        connectButton.display = 'none';
        disconnectButton.display = 'none';
        tutorial.display = 'none';
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

//Displays locking load ... when locking
lockingDisplay = function () {
    locking.style.display = 'block';
    typeWriter(null);
    locking.innerHTML = 'Working';
};

//Recursive function to type out ... for locking
function typeWriter(i) {
    i = i === null ? 0 : i;

    if (i !== 3) {
        locking.innerHTML += '.';
        i++;
        setTimeout(typeWriter, 500, locking, i);
    }
}