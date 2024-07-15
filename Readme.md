
# Gestión de Personal y Usuarios

Esta aplicación es una herramienta para la gestión de personal y usuarios, que permite agregar, editar, activar, desactivar y listar usuarios y personal. El frontend está desarrollado en React con TypeScript, y el backend está implementado en C# utilizando Entity Framework Core y JWT para la autenticación.

## Características

- **Autenticación de Usuarios**: Utiliza JWT para autenticación segura.
- **Gestión de Usuarios**: Permite listar, agregar, editar, activar y desactivar usuarios.
- **Gestión de Personal**: Permite listar, agregar, editar, activar y desactivar personal.
- **Validación de Formularios**: Utiliza `react-hook-form` para la gestión y validación de formularios.
- **Alertas**: Utiliza Bootstrap para mostrar alertas que desaparecen automáticamente después de 2 segundos.

## Tecnologías Utilizadas

### Frontend

- React
- TypeScript
- react-bootstrap
- react-hook-form
- FontAwesome

### Backend

- C#
- .NET
- Entity Framework Core
- MySQL
- JSON Web Tokens (JWT)

## Instalación y Configuración

### Backend

1. **Clonar el repositorio**:
    ```bash
    git clone <https://github.com/nicoriver9/CSharp-ReactTs-User-Personal-CRUD.git/Backend>
    ```

2. **Configurar la base de datos**:
   - Crear una base de datos MySQL.
   - Actualizar la cadena de conexión en `appsettings.json` con los detalles de tu base de datos MySQL.

3. **Migrar la base de datos**:
    ```bash
    dotnet ef database update
    ```

4. **Ejecutar la aplicación**:
    ```bash
    dotnet run
    ```

### Frontend

1. **Clonar el repositorio** (si no lo has hecho ya):
    ```bash
    git clone <https://github.com/nicoriver9/CSharp-ReactTs-User-Personal-CRUD.git/Frontend>
    ```

2. **Instalar las dependencias**:
    ```bash
    cd frontend
    npm install
    ```

3. **Configurar la URL del backend**:
   - Actualiza el archivo `src/helpers/apiConfig.ts` con la URL de tu backend.

4. **Ejecutar la aplicación**:
    ```bash
    npm start
    ```

## Uso

### Gestión de Usuarios

1. Iniciar sesión con credenciales de administrador.
2. Navegar a la página de gestión de usuarios.
3. Realizar las operaciones de agregar, editar, activar y desactivar usuarios según sea necesario.

### Gestión de Personal

1. Iniciar sesión con credenciales de administrador.
2. Navegar a la página de gestión de personal.
3. Realizar las operaciones de agregar, editar, activar y desactivar personal según sea necesario.


## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
