# ESP_32_WEB_SERVER

Es un servidor web asincrono para el control del ESP32

Se usaron las siguientes librerias esternas:

ESPAsyncWebServer = https://github.com/me-no-dev/ESPAsyncWebServer.git

AsyncTCP = https://github.com/me-no-dev/AsyncTCP


Configuración platformio.ini

[env:esp32doit-devkit-v1]
platform = espressif32
board = esp32doit-devkit-v1
framework = arduino
monitor_speed = 115200
lib_deps = https://github.com/me-no-dev/ESPAsyncWebServer.git
