var bleDevice;
var bleServer;
var bleService;
var battChar;
var lockChar;
var lockNotChar;
var pass = new Uint16Array([0x1111]);

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
            acceptAllDevices: true,
            optionalServices: [0xB10C]
        })
        .then(device => {
            bleDevice = device;
            console.log('Connecting to GATT Server...');
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
        console.log('No Bluetooth Device connected...');
        return;
    }
    console.log('Disconnecting from Bluetooth Device...');
    if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        console.log('Bluetooth Device connected: ' + bleDevice.gatt.connected);
    } else {
        console.log('Bluetooth Device is already disconnected');
    }
}

//Battery voltage reading. Should be called after connecting
function getBatt() {
    console.log('Reading Battery Level...');
    let battLevelChar = battChar.readValue();

    battLevelChar.then(value => {
        var i;
        var voltage;

        voltage = String.fromCharCode(value.getUint8(0), value.getUint8(1), value.getUint8(2));

        voltage = parseInt(voltage);

        voltage = voltage * 2;
        voltage = voltage * 3.3;
        voltage = voltage / 1024;

        console.log('Voltage is ' + voltage + ' Volts');
    })
}

//Should not have to be called from anywhere but here
function onChanged(event) {
    let value = event.target.value;    

    let out = value.getUint8(0);

    console.log("lock response: " + out);
    newP();
}

//this function will move the stepper motor
function lock() {
    console.log('Locking');
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
}
