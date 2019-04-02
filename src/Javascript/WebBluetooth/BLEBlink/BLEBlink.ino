#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"
#include "Adafruit_BLEGatt.h"

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
  #include <SoftwareSerial.h>
#endif

    #define FACTORYRESET_ENABLE         1
    #define MINIMUM_FIRMWARE_VERSION    "0.6.6"

Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

Adafruit_BLEGatt gatt(ble);

#define VBATPIN A9

unsigned long pass = 0x1111;
bool lock = true;

void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

// the setup function runs once when you press reset or power the board
void setup() {

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ){
      error(F("Couldn't factory reset"));
    }
  }

  ble.println("AT+BLEPOWERLEVEL=4" );

  ble.println("AT+GAPDEVNAME=Bike Lock" );

  ble.println("AT+GATTADDSERVICE=UUID=0xb10c" );

  ble.println("AT+GATTADDCHAR=UUID=0xBA77,PROPERTIES=0x02,MIN_LEN=3,DATATYPE=1,DESCRIPTION=BATTERY" );

  ble.println("AT+GATTADDCHAR=UUID=0x10cc,PROPERTIES=0x08,MIN_LEN=2,MAX_LEN=2,VALUE=0x0000,DESCRIPTION=LOCK" );

  ble.println("AT+GATTADDCHAR=UUID=0x10ca,PROPERTIES=0x10,MIN_LEN=1,MAX_LEN=1,VALUE=0x00,DESCRIPTION=LOCK_STATUS" );

  ble.println( "ATZ" );

  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {

  ble.print("AT+GATTCHAR=1,");
  ble.println(analogRead(VBATPIN));

  //Serial.println(gatt.getChar(0x10cc));
  ble.sendCommandCheckOK(F( "AT+GATTCHAR=2" ));
  ble.sendCommandCheckOK(F( "AT+GATTCHAR=2" ));
  char buf[8];
  memset(buf, 0, 8);
  memcpy(buf, ble.buffer, 8);

  Serial.print("Passout: ");
  Serial.print(buf);
  Serial.print(" ");
  Serial.print(pass);
  Serial.print(" ");
  Serial.println(strtoul(buf, NULL, 0) == pass);
  

  if (strtoul(buf, NULL, 0) == pass) {
    if (lock) {
      digitalWrite(LED_BUILTIN, HIGH);
      lock = false;
      ble.print("AT+GATTCHAR=3,");
      ble.println("1");
    }
    else
    {
      digitalWrite(LED_BUILTIN, LOW);
      lock = true;
      ble.print("AT+GATTCHAR=3,");
      ble.println("0");
    }
    newP();
  }
  
  delay(5000);
}

void newP() {
  pass = ((pass * pass) & 0x00FFFF00) >> 8;
  Serial.print("Pass: ");
  Serial.println(pass);
}
