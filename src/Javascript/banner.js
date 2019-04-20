//Turns banner on and off for displaying buttons to lock and such

banner = function (location) {
    let bannerData = [document.getElementsByClassName('banner')[0].style,
        document.getElementsByClassName('banner_location')[0],
        document.getElementsByClassName('banner_info')[0].style];

    location.title !== 'Your location' ? lockMarker(bannerData, location) :
        userMarker(bannerData, location.title);

};

userMarker = function (data, title) {
    if (data[0].display !== 'block') {
        data[0].display = 'block';
    }
    else if (title === data[1].innerHTML) {
        data[0].display = 'none';
    }
    data[1].innerHTML = title;
    data[2].display = 'block';

    buttonDisplay(0);
};

lockMarker = function  (data, title) {
    if (data[0].display !== 'block') {
        data[0].display = 'block';
    }
    else if (title[0] === data[1].innerHTML) {
        data[0].display = 'none';
    }

    data[0].backgroundColor = '#46b94f';
    data[1].innerHTML = title[0];
    data[2].display = 'none';

    if (availableLocks[title[3]][0] === 0) {
        data[0].backgroundColor = '#db1011';
        buttonDisplay(0);
    }
    else if (!bleDevice || !bleDevice.gatt.connected) {
        buttonDisplay(1);

    }
    else if (bleDevice.gatt.connected) {
        data[1].innerHTML = 'You are connected';
        buttonDisplay(2);
    }
};

//Allows us to set styling based on a numerical choice of 0, 1, or 2
buttonDisplay = function (choice) {
    let connectButton = document.getElementsByClassName('connect')[0].style;
    let disconnectButton = document.getElementsByClassName('disconnect')[0].style;
    let lockButton = document.getElementsByClassName('lock')[0];

    if (choice === 0) {
        lockButton.style.display = 'none';
        connectButton.display = 'none';
        disconnectButton.display = 'none';
    }
    else if (choice === 1) {
        lockButton.innerHTML = 'Lock';
        lockButton.style.display = 'none';
        connectButton.display = 'block';
        disconnectButton.display = 'none';
    }
    else if (choice === 2) {
        lockButton.style.display = 'block';
        connectButton.display = 'none';
        disconnectButton.display = 'block';
    }
};

closeBanner = function () {
    alert('in');
    document.getElementsByClassName('banner')[0].style.display = 'none';
};

// availableLocks[title[3]][0]