const request = require('supertest');
const app = require('../aplicacion'); // Importamos la aplicación de Express

// Describimos un conjunto de pruebas para el endpoint de empleados
describe('Pruebas para la API de Empleados', () => {
  let token;

  // Antes de todas las pruebas, iniciamos sesión para obtener un token
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        // IMPORTANTE: Reemplaza esto con un usuario válido de tu base de datos de prueba
        nombre_usuario: 'administrador',
        contrasena: 'admin123' 
      });
    
    token = response.body.token; // Asumimos que el token se devuelve como `response.body.token`
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación. Verifica las credenciales de prueba y la respuesta del endpoint de login.');
    }
  });

  // Prueba para obtener todos los empleados
  it('Debería obtener una lista de empleados con un token válido', async () => {
    // Hacemos una petición a la ruta, incluyendo el token en la cabecera
    const response = await request(app)
      .get('/api/empleados/obtenerempleados')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    // Verificamos que el código de estado sea 200 (OK)
    expect(response.statusCode).toBe(200);

    // Verificamos que la respuesta sea un arreglo (una lista)
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Aquí puedes añadir más pruebas (POST, GET por ID, PUT, DELETE)...
});