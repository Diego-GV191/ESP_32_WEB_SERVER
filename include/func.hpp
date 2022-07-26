// Serial print
// s = texto, jump = salto de linea
void ConsoleLog(String s, bool jump = true)
{
    jump ? Serial.println(s) : Serial.print(s);
}

// Configuracion de pines
void ConfigPines(void)
{
    pinMode(2, OUTPUT);
    pinMode(PinSensor1, INPUT);
}

// funcion para obtener
// valores del sensor1
String Asensor1()
{
    return String(analogRead(PinSensor1));
}

// funcion para obtener
// la temperatura del CPU
String TempCPU()
{
    return String((temprature_sens_read() - 32) * 0.55);
}

// First request will return 0 results unless you start scan from somewhere else (loop/setup)
// Do not request more often than 3-5 seconds
String ScanWifi()
{
    String json = "[";
    int n = WiFi.scanComplete();
    if (n == -2)
    {
        WiFi.scanNetworks(true);
    }
    else if (n)
    {
        for (int i = 0; i < n; ++i)
        {
            if (i)
                json += ",";
            json += "{";
            json += "\"rssi\":" + String(WiFi.RSSI(i));
            json += ",\"ssid\":\"" + WiFi.SSID(i) + "\"";
            json += ",\"bssid\":\"" + WiFi.BSSIDstr(i) + "\"";
            json += ",\"channel\":" + String(WiFi.channel(i));
            json += ",\"secure\":" + String(WiFi.encryptionType(i));
            json += "}";
        }
        WiFi.scanDelete();
        if (WiFi.scanComplete() == -2)
        {
            WiFi.scanNetworks(true);
        }
    }
    json += "]";
    return json;
}

// funcion para cambiar el
// estado del LED interno
String ChangeLEd()
{
    if (statusLED)
    {
        digitalWrite(2, HIGH);
        statusLED = false;
        return "ya se prendio";
    }
    else
    {
        digitalWrite(2, LOW);
        statusLED = true;
        return "ya se apago";
    }
}

// Retorna IPAddress en formato "n.n.n.n" de IP a String
String ipStr(const IPAddress &ip)
{
    String sFn = "";
    for (byte bFn = 0; bFn < 3; bFn++)
    {
        sFn += String((ip >> (8 * bFn)) & 0xFF) + ".";
    }
    sFn += String(((ip >> 8 * 3)) & 0xFF);
    return sFn;
}

// De HEX a String
String hexStr(const unsigned long &h, const byte &l = 8)
{
    String s;
    s = String(h, HEX);
    s.toUpperCase();
    s = ("00000000" + s).substring(s.length() + 8 - l);
    return s;
}

// Create a Unique ID from MAC address
String idUnique()
{
    // Retorna los ultimos 4 Bytes del MAC rotados
    char idunique[15];
    uint64_t chipid = ESP.getEfuseMac();
    uint16_t chip = (uint16_t)(chipid >> 32);
    snprintf(idunique, 15, "%04X", chip);
    return idunique;
}

// ID del Dispositivo
const String device_id = hexStr(ESP.getEfuseMac()) + "CE" + String(idUnique());
// ESP32 utiliza funcion getEfuseMac()
String deviceID()
{
    return "ESP32" + hexStr(ESP.getEfuseMac()) + String(idUnique());
}