# 🎮 Game Store - Prueba de API de Productos

## Configuración de Spring Boot

### 1. Verificar que tu servidor Spring Boot esté corriendo en: `http://localhost:9090`

### 2. Endpoint esperado: `http://localhost:9090/productos`

## Métodos de API implementados en Angular:

- **GET /productos** - Obtener todos los productos
- **GET /productos/{id}** - Obtener producto por ID
- **POST /productos** - Crear nuevo producto
- **PUT /productos/{id}** - Actualizar producto existente
- **DELETE /productos/{id}** - Eliminar producto

## Estructura de Producto esperada:

```json
{
  "id": 1,
  "nombre": "Epic Adventure Chronicles",
  "descripcion": "Un juego de aventuras épico con gráficos increíbles",
  "precio": 59.99,
  "categoria": "rpg",
  "imagen": "https://ejemplo.com/imagen.jpg",
  "stock": 50,
  "activo": true
}
```

## Cómo probar:

### 1. Asegúrate de que Spring Boot esté corriendo
```bash
# En tu proyecto Spring Boot
mvn spring-boot:run
# o
./gradlew bootRun
```

### 2. Inicia el servidor Angular
```bash
cd c:/Users/ASUS/Documents/Angular/game-store
ng serve
```

### 3. Ve a la página de productos: http://localhost:4200/productos

### 4. Si eres admin (usuario logueado), verás:
- Botón "➕ Nuevo Producto" para agregar productos
- Botones de editar (✏️) y eliminar (🗑️) en cada producto
- Formulario modal para crear/editar productos

## Pruebas con herramientas externas:

### Con Postman o cURL:

#### Crear un producto:
```bash
curl -X POST http://localhost:9090/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Game",
    "descripcion": "Juego de prueba",
    "precio": 29.99,
    "categoria": "accion",
    "stock": 100,
    "activo": true
  }'
```

#### Obtener productos:
```bash
curl -X GET http://localhost:9090/productos
```

## Configuración de CORS en Spring Boot:

Asegúrate de que tu Spring Boot tenga configurado CORS para permitir requests desde Angular:

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/productos")
public class ProductoController {
    // tus endpoints aquí
}
```

## Solución de problemas:

### Si no se cargan los productos:
1. Verifica que Spring Boot esté corriendo en puerto 9090
2. Revisa la consola del navegador para errores de CORS
3. Confirma que el endpoint `/productos` existe en tu Spring Boot
4. Verifica que la estructura JSON coincida con lo esperado

### Si no puedes crear productos:
1. Verifica que estés logueado (necesario para ver los botones de admin)
2. Confirma que el endpoint POST esté configurado
3. Revisa que no falten campos requeridos en el formulario