#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include "esp32-hal-cpu.h"
#include "header.hpp"
#include "func.hpp"

// Servidor en el puesto 80
AsyncWebServer server(80);

void setup()
{
  ConfigPines();
  Serial.begin(115200);

  if (!SPIFFS.begin())
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  WiFi.begin(SSID, PASS);
  Serial.print("Connecting to WiFi..");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(200);
    Serial.print(".");
  }

  Serial.print("\n\n\t");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Sirva el archivo "/www/page.htm" cuando la URL de la solicitud sea "/page.htm"
  // server.serveStatic("/page.htm", SPIFFS, "/www/page.htm");
  server.serveStatic("/styles.css", SPIFFS, "/styles.css").setDefaultFile("styles.css");
  server.serveStatic("/cpde.js", SPIFFS, "/cpde.js").setDefaultFile("cpde.js");
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/index.html"); });
  server.on("/btn-built", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", ChangeLEd().c_str()); });
  server.on("/temp-cpu", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", TempCPU().c_str()); });
  server.on("/AnalogSensor", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", Asensor1().c_str()); });
  server.on("/deviceID", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", deviceID().c_str()); });
  server.on("/scan", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "application/json", ScanWifi().c_str()); });
  server.begin();
}

void loop()
{
}