import serial
import requests
import time

# 1. CONFIGURA TU PUERTO ARDUINO
# (Esta ruta ya es la correcta para ti)
PUERTO_ARDUINO = "/dev/cu.usbmodem1301"  
    
# 2. CONFIGURA LA URL DE TU API
URL_API = "http://localhost/AGROSENCE/api/api_ingesta.php"

print("Iniciando script puente...")

try:
    # Conecta con el Arduino
    arduino = serial.Serial(PUERTO_ARDUINO, 9600, timeout=1)
    time.sleep(2) # Espera a que la conexión se establezca
    print(f"Conectado a Arduino en {PUERTO_ARDUINO}")
except serial.SerialException as e:
    print(f"Error: No se pudo conectar a {PUERTO_ARDUINO}.")
    print(f"Detalle: {e}")
    print("Asegúrate de que el puerto sea correcto y que el Monitor Serial del IDE esté cerrado.")
    exit()

while True:
    try:
        # 3. Lee una línea de datos del Arduino
        linea_datos = arduino.readline().decode('utf-8').strip()

        # Si la línea no está vacía (ej: "ph=7.0&humedad=100.0")
        if linea_datos:
            print(f"Datos recibidos: {linea_datos}")
            
            # --- ¡AQUÍ ESTÁ LA MAGIA! ---
            # Convertimos el string "ph=7.0&humedad=100.0" en un
            # diccionario que POST pueda entender: {'ph': '7.0', 'humedad': '100.0'}
            
            data_payload = {}
            try:
                pairs = linea_datos.split('&') # ['ph=7.0', 'humedad=100.0']
                for pair in pairs:
                    key, value = pair.split('=')
                    data_payload[key] = value # {'ph': '7.0', ...}
                
                # 5. Envía los datos a tu API usando POST (en lugar de GET)
                # La URL_API es solo la dirección, los datos van en 'data='
                respuesta = requests.post(URL_API, data=data_payload)
                
                # ¡Si todo sale bien, esto mostrará tu mensaje de "éxito" de PHP!
                print(f"Datos enviados a la API. Respuesta del servidor: {respuesta.text}")
            
            except ValueError:
                print(f"Error: Datos recibidos en formato incorrecto: {linea_datos}")
            except requests.exceptions.RequestException as e:
                print(f"Error al conectar con la API en {URL_API}: {e}")
            
    except serial.SerialException as e:
        print(f"Error leyendo del puerto serial: {e}")
        break # Termina el script si se desconecta el Arduino
    except UnicodeDecodeError:
        print("Error de decodificación. Ignorando línea.")
        pass 
        
    time.sleep(1) # Pequeña pausa