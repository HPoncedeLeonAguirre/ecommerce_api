# API de Gestión de Pedidos - Documentación

Esta API permite gestionar órdenes y productos para una plataforma de comercio electrónico. Los usuarios pueden autenticarse, crear y ver sus órdenes, y los administradores pueden gestionar el estado de las órdenes.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework web para Node.js.
- **Sequelize**: ORM para interactuar con bases de datos PostgreSQL.
- **PostgreSQL**: Base de datos relacional.
- **JWT**: Autenticación mediante JSON Web Tokens.
- **bcrypt**: Encriptación de contraseñas.

## Instalación

Sigue estos pasos para configurar y ejecutar la API en tu entorno local:

1. Clona el repositorio:
    ```bash
    git clone <repositorio_url>
    cd <nombre_del_repositorio>
2. Instala las dependencias necesarias estando parado en la carpeta api:
    ```bash
    npm install
3. Crea un archivo .env en la carpeta api con las siguientes variables:
    ```env
    DB_URL=postgres://postgres:contraseña@localhost:5432/ecommerce (Cambia contraseña por tu contraseña de postgresSQL)
    JWT_SECRET=tucontraseñasegura
4. Inicia el servidor:
    ```bash
    npm start

    Verás algo así:

    $ npm start

    > api@1.0.0 start
    > nodemon index.js

    [nodemon] 3.1.4
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,cjs,json
    [nodemon] starting `node index.js`
    Server listening on port http://localhost:3001
    ```

## Endpoints 

Vamos a seguir el flujo para poder usar correctamente la api.
Probar estos endpoints en Insomnia, Thunder Client o parecidos.

1. Registrar usuario:
    ```
    POST /users

    http://localhost:3001/users/

    Body:
        {
            "name": "nombre del usuario",
            "mail": "xxxxxx@ejemplo.com",
            "password": "xxxxxxxxx",
            "phone": 987654321
        }
    ```
    Tener en cuenta de guardar la contraseña para iniciar sesión, ya que después se transforma en una cadena de texto por seguridad.

    Con este endpoint podrás crear/registrar un usuario.

2. Logear usuario:
    ```
    POST /users/login

    http://localhost:3001/users/login

    Body:
        {
            "mail": "maildeusuarioregistrado",
            "password": "contraseñaDeUsuarioRegistrado"
        }
    ```
    Con este endpoint podrás logear usuarios.

3. Crear y guardar un producto en la base de datos:
    ```
    POST /products

    http://localhost:3001/products

    Body:
        {
            "name": "Nombre del producto",
            "price": precio del producto,
            "stock": stock del producto,
            "description": "descripción del producto"
        }
    ```
    Con este endpoint podrás crear y guardar productos en la base de datos.

4. Crear un pedido:
    ```
    POST /orders

    http://localhost:3001/orders

    Body:
        {
            "id_User": "id del usuario que quiere crear el pedido, es uuid",
            "products": [
            {
                "id_Product": "id del producto seleccionado, es uuid",
                "quantity": 2
            },
            {
                "id_Product": "id del producto seleccionado, es uuid",
                "quantity": 3
            }
            ],
            "shippingAddress": "Dirección de entrega"
        }

    auth --> Bearer --> token del usuario
    ```
    Con este endpoint puedes crear el pedido.

5. Visualizar pedido:
    ```
    GET /orders/id_Order

    http://localhost:3001/orders/id_Order

    auth --> Bearer --> token del usuario
    ```
    Con este endpoint el usuario puede ver un pedido en específico, pero solo si él la creó.

6. Listado de pedidos:
    ```
    GET /orders/id_User/orders?page=X&limit=X&status=xxxxxx

    http://localhost:3001/orders/id_User/orders?page=X&limit=X&status=xxxxxx

    auth --> Bearer --> token del usuario
    ```
    Con este endpoint el usuario podrá listar todos sus pedidos, además la lista estará paginada y podrá filtrar los pedidos por su estado.

7. Actualizar estado de pedido:
    ```
    PATCH /orders/id_Order/status

    http://localhost:3001/orders/id_Order/status

    Body:
        {
            "status": "nuevo estado"
        }

        auth --> Bearer --> token de administrador
    ```
    Con este endpoint un administrador podrá cambiar el estado de un pedido.

## Pruebas unitarias

Para poder ejecutar las pruebas unitarias tendrás que utilizar este comando:
```
npm test
```
