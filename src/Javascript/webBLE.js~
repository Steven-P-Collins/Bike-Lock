var bleDevice;
var bleServer;
var bleService;
var battChar;
var lockChar;
var lockNotChar;
var pass = new Uint16Array([0x1110]);
var lockID = 'Bike Lock';

/*
    Available Locks holds the key followed by
    [Free locks, Locks in use, Total Locks]
 */

var availableLocks;
//Grab lock locations for webBLE variable availableLocks
getLocks();


document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName("connect")[0].onclick = connect;
    document.getElementsByClassName("disconnect")[0].onclick = disconnect;
    document.getElementsByClassName("lock")[0].onclick = lock;
    locking = document.getElementsByClassName('banner_Locking')[0];
    // document.getElementsByClassName('nearest_Lock')[0] = nearestLock;
});

//For now the out put is just to the console. if you call the function it will do what you expect.
//There is no point in changing the console outs until the DB is finished

//view the html to see how I implemented the file.

//initialzation function. Should be called when the user wants to find a lock with BLE.
function connect() {

    if (!navigator.bluetooth) {
        console.log('> WebBluetooth API is not available.\n' +
            '> Please make sure the Web Bluetooth flag is enabled.');
        return;
    }
    console.log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(
        {
            filters: [
                {name: [lockID]}
            ],
            optionalServices: [0xB10C]
        })
        .then(device => {
            bleDevice = device;
            console.log('Connecting to GATT Server...');
            getPass();
            return device.gatt.connect();
        })
        .then(server => {
            bleServer = server;
            console.log('Getting Service...');
            return server.getPrimaryService(0xB10C);
        }).then(service => {
            bleService = service;
        })
        .then(() => {
            console.log('locate Battery characteristic');
            return bleService.getCharacteristic(0xBA77);
        })
        .then(characteristic => {
            battChar = characteristic;
            console.log('found Battery characteristic');
        })
        .then(() => {
            console.log('locate Lock characteristic');
            return bleService.getCharacteristic(0x10CC);
        })
        .then(characteristic => {
            lockChar = characteristic;
            console.log('found Lock characteristic');

        })
        .then(() => {
            console.log('locate Lock Notify characteristic');
            return bleService.getCharacteristic(0x10CA);
        })
        .then(characteristic => {
            lockNotChar = characteristic;
            console.log('found Lock characteristic');
            buttonDisplay(2);
            return lockNotChar.startNotifications().then(_ => {
                console.log('Notifications started');
                lockNotChar.addEventListener('characteristicvaluechanged', onChanged);
            });
        })
        .catch(error => {
            console.log('YOU SHALL NOT PASS: ' + error);
        });

}

//disconnection process. Can be used for choosing another lock
function disconnect() {

    if (!bleDevice) {
        alert('No Bluetooth Device connected...');
    }
    else if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        console.log('Bluetooth Device connected: ' + bleDevice.gatt.connected);
        buttonDisplay(1);
    }
}
//Battery voltage reading. Should be called after connecting
function getBatt() {

    let battLevelChar = battChar.readValue();

    battLevelChar.then(value => {
        var i;
        var voltage;

        voltage = String.fromCharCode(value.getUint8(0), value.getUint8(1), value.getUint8(2));

        voltage = parseInt(voltage);

        voltage = voltage * 2;
        voltage = voltage * 3.3;
        voltage = voltage / 1024;

        console.log(voltage);
    });
}


//Should not have to be called from anywhere but here
function onChanged(event) {
    let value = event.target.value;
    let lockButtonText = document.getElementsByClassName('lock')[0];

    let out = value.getUint8(0);

    console.log("lock response: " + out);
    newP();
    lockButtonText.innerHTML = lockButtonText.innerHTML === 'Lock' ? 'Unlock' : 'Lock';
}

//this function will move the stepper motor
function lock() {
    //Hides buttons so users cannot disconnect while state changing
    buttonDisplay(4);
	lockChar.writeValue(pass)
        .then(_ => {
            console.log('Lock characteristic changed to: ' + pass);
        })
        .catch(error => {
            console.log('Error in lock: ' + error);
        });
}

//generates a new password should not be called anywhere but here
function newP() {
    console.log('Creating new password');
    pass = new Uint16Array([((pass * pass) & 0x00FFFF00) >> 8]);
	console.log(pass);
	//Allows buttons to reappear after state change completed
    buttonDisplay(2);

    storePass();
}

function storePass() {
    xmlhttpPOST = window.XMLHttpRequest ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttpPOST.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
        }
    };
    console.log(parseInt(pass));

    xmlhttpPOST.open("POST", "src/PHP/postPIN.php?id="+lockID+"&p="+pass, true);
    xmlhttpPOST.send();
}

function getPass() {
    xmlhttpGET = window.XMLHttpRequest ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttpGET.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            pass[0] = parseInt(this.responseText, 16);
            console.log(pass);
        }
    };

    xmlhttpGET.open("GET", "src/PHP/getPIN.php?id="+lockID, true);
    xmlhttpGET.send();

}

function getLocks() {
    xmlhttpGET = window.XMLHttpRequest ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttpGET.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            availableLocks = JSON.parse(this.responseText);
        }
    };

    xmlhttpGET.open("GET", "src/PHP/locks.php?", true);
    xmlhttpGET.send();

}
