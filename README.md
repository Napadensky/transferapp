## 🚀 Quick Start

Follow these steps to set up and run the project:

### 1. Install Dependencies

Before you can run the API, you need to install the project's dependencies. You can do this with the following command:

```bash
npm install
```

2. Database Setup
After installing the dependencies, you need to set up the database. You can do this by running the following commands in order:

```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

These commands will create the database, run the migrations, and seed the database with initial data, respectively.

3. Run the Project
With the dependencies installed and the database set up, you can now run the project with the following command:

```bash
npm run dev
```

o


```bash
npm start
```
---

## 🗄️ Setting up PostgreSQL with Docker Compose

To facilitate the setup of a PostgreSQL instance, we've provided a Docker Compose configuration. Simply execute the following commands:

1. To start the PostgreSQL instance:

```bash
docker-compose up
```

2. To stop the PostgreSQL instance:

```bash
docker-compose down
```

By using this setup, you can easily manage a PostgreSQL instance within a Docker container.

---
 
## Endpoints

For ease of testing, a directory named __http__ has been created at the root of this project. Inside this directory, you'll find three files dedicated to testing the endpoints.

To utilize these test files:

Install the REST Client extension for Visual Studio Code.
Open the files within the __http__ directory using VSCode.
You'll see an option to Send Request at the top of each file. Click on it to execute the request.
This provides a convenient way to test the API endpoints directly from within VSCode without the need for external tools.




- REST API endpoint table

| Endpoint                                   | Método       | Descripción                                                          |
| ------------------------------------------ | ------------ | -------------------------------------------------------------------- |
| `/api/v1/healt`                            | `GET`        | status and show users demo                                           |
| `/api/v1/auth/login`                       | `POST`       | Authenticates the user                                               |
| `/api/v1/auth/register`                    | `POST`       | Registers the user                                                   |
| `/api/v1/accounts`                         | `POST` `GET` | Creates a Current, Savings, or BasicSaving account and show accounts |
| `/api/v1/accounts/:accountId`              | `DELETE`     | Gets the details of an account and deletes it                        |
| `/api/v1/accounts/:accountId/transactions` | `GET`        | Gets the transactions of an account                                  |
| `/api/v1/accounts/:accountId/balances`     | `GET`        | Gets the account statement                                           |
| `/api/v1/transfer`                         | `POST`       | make a transfer                                                      |

- Below are examples of using the endpoints Here are examples of usage for each of the endpoints, including the request body and response:

1. `/api/v1/auth/login` (POST)

   - Request body:

   ```json
   {
     "username": "juan",
     "password": "contraseña123"
   }
   ```

   - Response:

   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

2. `/api/v1/auth/register` (POST)

   - Request body:

   ```json
   {
     "username": "juan",
     "password": "contraseña123"
   }
   ```

   - Response:

   ```json
   {
     "message": "Usuario registrado con éxito"
   }
   ```

3. `/api/v1/accounts` (POST)

   - Request body:

   ```json
   {
     "type": "savings"
   }
   ```

   - Response:

   ```json
   {
     "accountId": 12345,
     "type": "savings",
     "balance": 0
   }
   ```

4. `/api/v1/accounts/:accountId` (GET, PUT, DELETE)

   - GET
     - Response:
     ```json
     {
       "accountId": 12345,
       "type": "savings",
       "balance": 1000
     }
     ```
   - DELETE
     - Response:
     ```json
     {
       "message": "Cuenta eliminada con éxito"
     }
     ```

5. `/api/v1/accounts/:accountId/transactions?page=[page]&size=[size]` (GET)

   - Response:

   ```json
   {
     "totalItems": 50,
     "page": 5,
     "size": 10,
     "currentPage": 1,
     "data": [
       {
         "transactionId": 1,
         "type": "deposito",
         "amount": 1000,
         "date": "2023-08-24T10:14:29-03:00"
       },
       {
         "transactionId": 1,
         "type": "deposito",
         "amount": 1000,
         "date": "2023-08-24T10:14:21-02:00"
       }
     ]
   }
   ```

6. `/api/v1/accounts/:accountId/balances?page=[page]&size=[size]` (GET)

   - Response:

   ```json
    {
      "account": {
        "id": 17,
        "userId": 10,
        "accountType": "Current",
        "balance": 300,
        "status": "OPEN",
        "createdAt": "2023-08-25T17:42:00.677Z",
        "updatedAt": "2023-08-25T19:30:22.716Z"
      },
      "totalItems": 50,
      "page": 5,
      "size": 10,
      "currentPage": 1,
      "data": [
          {
            "id": 11,
            "type": "current",
            "amount": 1000,
            "data": "2023-08-24T10:14:29-03:00"
          }
          {
            "id": 11,
            "type": "current",
            "amount": 1030,
            "data": "2023-08-24T10:14:23-02:00"
          }
      ]
   }
   ```

7. `/api/v1/transfer` (POST)
   - Request body:
   ```json
   {
     "fromAccountId": 12345,
     "toAccountId": 67890,
     "amount": 100
   }
   ```
   - Response:
   ```json
   {
     "transactionId": 3,
     "fromAccountId": 12345,
     "toAccountId": 67890,
     "amount": 100,
     "date": "2023-08-26T10:14:29-03:00"
   }
   ```
