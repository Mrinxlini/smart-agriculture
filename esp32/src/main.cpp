#include <Adafruit_Sensor.h>
#include <WiFi.h>  //BOARD: "ESP32-WROOM-DA Module"

#include "ThingSpeak.h"
#include "secrets.h"

const char* ssid = WIFI_SSID;          // your network SSID (name)
const char* password = WIFI_PASSWORD;  // your network password

const char* myWriteAPIKey = THINGSPEAK_WRITE_API_KEY;  // Edit CHANNEL WRITE API key according to your Account

WiFiClient client;

unsigned long myChannelNumber = 1916975;  // Edit channel ID

#include "DHT.h"
#define DHTPIN1 4  // Digital pin connected to the DHT sensor
#define DHTPIN2 5

#define DHTTYPE DHT22  // DHT 22

#define AOUT_PIN1 36  // ESP32 pin GIOP36 (ADC0) that connects to AOUT pin of moisture sensor
#define AOUT_PIN2 39  // ESP32 pin GIOP36 (ADC1) that connects to AOUT pin of moisture sensor

DHT dht1(DHTPIN1, DHTTYPE);
DHT dht2(DHTPIN2, DHTTYPE);

// Timer variables
unsigned long lastTime = 0;
unsigned long timerDelay = 15 * 1000;  // minimum delay between updates must be 15 seconds

const unsigned int TEMP_1_CHANNEL = 1;
const unsigned int HUMIDITY_1_CHANNEL = 2;
const unsigned int TEMP_2_CHANNEL = 3;
const unsigned int HUMIDITY_2_CHANNEL = 4;

const unsigned int SOIL_MOISTURE_1_CHANNEL = 5;
const unsigned int SOIL_MOISTURE_2_CHANNEL = 6;

/// @brief Reconnect to WiFi if connection is lost or not established
void wifi_reconnect() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.print("Attempting to connect");

        while (WiFi.status() != WL_CONNECTED) {
            Serial.print(".");
            WiFi.begin(ssid, password);
            delay(1000);
        }

        Serial.println("\nWiFi Connected");
    }
}

int write_to_thingspeak(int field, float value) {
    int status = ThingSpeak.writeField(myChannelNumber, field, value, myWriteAPIKey);

    return status;
}

void setup() {
    Serial.begin(115200);  // Initialize serial
    WiFi.mode(WIFI_STA);
    ThingSpeak.begin(client);  // Initialize ThingSpeak

    Serial.println(F("DHT22 test!"));
    Serial.println(F("Moisture sensor test!"));
    dht1.begin();
    dht2.begin();

    wifi_reconnect();
}

void loop() {
    if ((millis() - lastTime) > timerDelay) {
        // Connect or reconnect to WiFi
        wifi_reconnect();

        Serial.print("************Sensor Readings************ \n");

        int soil_moisture1 = analogRead(AOUT_PIN1);  // read the analog value from sensor
        int soil_moisture_percentage1 = map(soil_moisture1, 0, 4095, 100, 0);

        int soil_moisture2 = analogRead(AOUT_PIN2);  // read the analog value from sensor
        int soil_moisture_percentage2 = map(soil_moisture2, 0, 4095, 100, 0);

        Serial.print("Soil Moisture1: ");
        Serial.println(soil_moisture_percentage1);

        Serial.print("Soil Moisture2: ");
        Serial.println(soil_moisture_percentage2);

        // Wait a few seconds between measurements.
        delay(500);

        // Reading temperature or humidity takes about 250 milliseconds!
        // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
        float h1 = dht1.readHumidity();
        // Read temperature as Celsius (the default)
        float t1 = dht1.readTemperature();

        // Check if any reads failed and exit early (to try again).
        if (isnan(h1) || isnan(t1)) {
            Serial.println(F("Failed to read from DHT1 sensor!"));
            return;
        }

        Serial.print(F("Humidity1: "));
        Serial.print(h1);
        Serial.print(F("%  Temperature1: "));
        Serial.print(t1);
        Serial.print(F("°C \n"));

        //********************
        float h2 = dht2.readHumidity();
        // Read temperature as Celsius (the default)
        float t2 = dht2.readTemperature();
        // Read temperature as Fahrenheit (isFahrenheit = true)
        float f2 = dht2.readTemperature(true);

        // Check if any reads failed and exit early (to try again).
        if (isnan(h2) || isnan(t2) || isnan(f2)) {
            Serial.println(F("Failed to read from DHT2 sensor!"));
            return;
        }

        Serial.print(F("Humidity2: "));
        Serial.print(h2);
        Serial.print(F("%  Temperature2: "));
        Serial.print(t2);
        Serial.print(F("°C \n"));

        ThingSpeak.setField(1, t1);
        ThingSpeak.setField(2, h1);
        ThingSpeak.setField(3, t2);
        ThingSpeak.setField(4, h2);
        ThingSpeak.setField(5, soil_moisture_percentage1);
        ThingSpeak.setField(6, soil_moisture_percentage2);

        int response = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

        Serial.print("Response: ");
        Serial.println(response);

        lastTime = millis();
    }
}
