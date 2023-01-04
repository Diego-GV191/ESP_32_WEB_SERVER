#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include "esp32-hal-cpu.h"
#include "header.hpp"
#include "func.hpp"

// Servidor en el puesto 80
AsyncWebServer server(80);

// Variable para redundancia
uint8_t reset_esp = 0;

void setup()
{
  ConfigPines();
  Serial.begin(115200);

  if (!SPIFFS.begin())
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    ESP.restart();
    return;
  }

  WiFi.begin(SSID, PASS);
  Serial.print("Connecting to WiFi..");
  while (WiFi.status() != WL_CONNECTED)
  {
    if (reset_esp >= 50)
    {
      reset_esp = 0;
      ESP.restart();
    }
    else
    {
      delay(200);
      Serial.print(".");
      reset_esp++;
    }
  }

  Serial.print("\n\n\t");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP() + ":80");

  // Sirva el archivo "/www/page.htm" cuando la URL de la solicitud sea "/page.htm"
  // server.serveStatic("/page.htm", SPIFFS, "/www/page.htm");
  server.serveStatic("/styles.css", SPIFFS, "/styles.css").setDefaultFile("styles.css");
  server.serveStatic("/cpde.js", SPIFFS, "/cpde.js").setDefaultFile("cpde.js");
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/index.html"); });
  server.on("/temp-cpu", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", TempCPU().c_str()); });
  server.on("/AnalogSensor", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", Asensor1().c_str()); });
  server.on("/device-id", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send_P(200, "text/plain", deviceID().c_str()); });
  server.on("/scan", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "application/json", ScanWifi().c_str()); });
  server.on("/update", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    String message1;
    String message2;
    const char* PARAM_INPUT_1 = "output";
    const char* PARAM_INPUT_2 = "status";
    
    // Obtiene el valor <ESP_IP>/update?output=<valor>&state=<valor>
    if(request->hasParam(PARAM_INPUT_1) && request->hasParam(PARAM_INPUT_2)){
      message1 = request->getParam(PARAM_INPUT_1)->value();
      message2 = request->getParam(PARAM_INPUT_2)->value();
      digitalWrite(message1.toInt(), message2.toInt());
      Serial.print("/update?output=");
      Serial.print(message1);
      Serial.print("&state=");
      Serial.println(message2);
    }

    request->send(200, "text/plain", "OK"); });

  server.begin();
}

void loop()
{
}