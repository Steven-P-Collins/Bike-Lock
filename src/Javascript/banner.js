//Turns banner on and off for displaying buttons to lock and such
banner = function (location) {
    let banner = document.getElementsByClassName('banner')[0].style;
    //Array storing dom of data that needs populated
    let bannerData = [document.getElementsByClassName('banner_location')[0],
        document.getElementsByClassName('banner_info')[0]];

    location.title !== 'Your location' ? lockMarker(bannerData, location) :
        userMarker(bannerData, location.title);

    banner.display = banner.display === 'block' ? 'none' : 'block';
};

userMarker = function (data, title) {
    data[0].innerHTML = title;
    data[1].innerHTML = 'Here you will see examples of the type of actions ' +
        'you can perform when you click on an available rack';
    buttonDisplay(0);
};

lockMarker = function  (data, title) {
    data[0].innerHTML = title[0];

    if (availableLocks[title[3]][0] === 0) {
        data[1].innerHTML = 'No locks available';
        buttonDisplay(0);
    }
    else if (!bleDevice || !bleDevice.gatt.connected) {
        data[1].innerHTML = 'Available locks: ' + availableLocks[title[3]][0];
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

// availableLocks[title[3]][0]