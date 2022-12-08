#include <Adafruit_Sensor.h>
#include <WiFi.h>  //BOARD: "ESP32-WROOM-DA Module"

#include "ThingSpeak.h"
#include "secrets.h"

const char* ssid = WIFI_SSID;          // your network SSID (name)
const char* password = WIFI_PASSWORD;  // your network password

const char* myWriteAPIKey = THINGSPEAK_WRITE_API_KEY;  // Edit CHANNEL WRITE API key according to your Account

WiFiClient client;

unsigned long myChannelNumber = THINGSPEAK_CHANNEL_NUMBER;  // Edit channel ID

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

/// @brief Update the ThingSpeak channel with the sensor readings
/// @param temperature_1
/// @param temperature_2
/// @param humidity_1
/// @param humidity_2
/// @param soil_moisture_1
/// @param soil_moisture_2
/// @return int HTTP response code
int update_to_thingspeak(float temperature_1, float temperature_2, float humidity_1, float humidity_2, int soil_moisture_1, int soil_moisture_2) {
    ThingSpeak.setField(1, temperature_1);
    ThingSpeak.setField(2, humidity_1);
    ThingSpeak.setField(3, temperature_2);
    ThingSpeak.setField(4, humidity_2);
    ThingSpeak.setField(5, soil_moisture_1);
    ThingSpeak.setField(6, soil_moisture_2);

    int response = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

    if (response == 200) {
        Serial.println("Channel update successful.");
    } else {
        Serial.println("Problem updating channel. HTTP error code " + String(response));
    }

    return response;
}

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

        float h1 = dht1.readHumidity();     // Read humidity (percent)
        float t1 = dht1.readTemperature();  // Read temperature as Celsius (the default)

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

        float h2 = dht2.readHumidity();     // Read humidity (percent)
        float t2 = dht2.readTemperature();  // Read temperature as Celsius (the default)

        // Check if any reads failed and exit early (to try again).
        if (isnan(h2) || isnan(t2)) {
            Serial.println(F("Failed to read from DHT2 sensor!"));
            return;
        }

        Serial.print(F("Humidity2: "));
        Serial.print(h2);
        Serial.print(F("%  Temperature2: "));
        Serial.print(t2);
        Serial.print(F("°C \n"));

        // Update the ThingSpeak channel with the sensor readings
        update_to_thingspeak(t1, t2, h1, h2, soil_moisture_percentage1, soil_moisture_percentage2);

        lastTime = millis();
    }
}
