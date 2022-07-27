# ESP_32_WEB_SERVER

Es un servidor web asincrono para el control del ESP32

DOIT ESP32 DEVKIT V1

## Librerias esternas

[ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer.git)

[AsyncTCP](https://github.com/me-no-dev/AsyncTCP)

## Configuración

[PlatformIO](https://platformio.org/) es una herramienta profesional multiplataforma, multiarquitectura y marco múltiple para ingenieros de sistemas integrados y para desarrolladores de software que escriben aplicaciones para productos integrados.

Instalar [PlatformIO IDE](http://platformio.org/platformio-ide)

Configuración platformio.ini

```ini
[env:esp32doit-devkit-v1]
platform = espressif32
board = esp32doit-devkit-v1
framework = arduino
monitor_speed = 115200
lib_deps = https://github.com/me-no-dev/ESPAsyncWebServer.git
```
