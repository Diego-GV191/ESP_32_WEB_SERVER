const char *SSID = "<AZUL>";      // credencial WiFi
const char *PASS = "Taquitos.28"; // credencial WiFi

// Estado de led integrado
bool statusLED = true;

// pin sensor 1
uint8_t PinSensor1 = 34;

// Para ESP32 temperatura del CPU
#ifdef __cplusplus
extern "C"
{
#endif
    uint8_t temprature_sens_read();
#ifdef __cplusplus
}
#endif
uint8_t temprature_sens_read();
