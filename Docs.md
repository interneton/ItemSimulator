I can help you create a comprehensive `DOCS.md` file for your project. Based on the provided files, here is a draft of the documentation for the API endpoints and their respective functionalities.

---

# API Documentation

This document outlines the API routes and their corresponding functionality for the character, item, and user management system.

## Authentication

### 1. **User Registration**
   - **Endpoint:** `POST /auth/register`
   - **Description:** Registers a new user.
   - **Body:**
     ```json
     {
       "userId": "string",
       "password": "string",
       "confirmPassword": "string"
     }
     ```
   - **Response:**
     - `201 Created`: User successfully registered.
     - `400 Bad Request`: User already exists or password mismatch.

### 2. **User Login**
   - **Endpoint:** `POST /auth/login`
   - **Description:** Logs in an existing user and returns a JWT token.
   - **Body:**
     ```json
     {
       "userId": "string",
       "password": "string"
     }
     ```
   - **Response:**
     - `200 OK`: Returns the JWT token on successful login.
     - `401 Unauthorized`: Invalid credentials.

---

## Characters

### 1. **Create a Character**
   - **Endpoint:** `POST /characters/create`
   - **Authentication:** Required (JWT)
   - **Description:** Creates a new character for the logged-in user.
   - **Body:**
     ```json
     {
       "name": "string"
     }
     ```
   - **Response:**
     - `201 Created`: Character successfully created.
     - `400 Bad Request`: Character with the same name already exists or invalid input.

### 2. **Delete a Character**
   - **Endpoint:** `DELETE /characters/delete/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Deletes the specified character owned by the logged-in user.
   - **Response:**
     - `200 OK`: Character successfully deleted.
     - `403 Forbidden`: User does not own the character.
     - `404 Not Found`: Character does not exist.

### 3. **Get All Characters**
   - **Endpoint:** `GET /characters/all`
   - **Description:** Fetches all available characters.
   - **Response:**
     - `200 OK`: Returns a list of characters with their health and strength.

### 4. **Get Character Details**
   - **Endpoint:** `GET /characters/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Fetches detailed information about a specific character.
   - **Response:**
     - `200 OK`: Returns character details.
     - `404 Not Found`: Character does not exist.

### 5. **Earn Money for a Character**
   - **Endpoint:** `POST /characters/earn-money/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Adds a specified amount of money to the character.
   - **Body:**
     ```json
     {
       "amount": "number"
     }
     ```
   - **Response:**
     - `200 OK`: Money successfully added to the character.
     - `404 Not Found`: Character does not exist.

### 6. **Get Character Inventory**
   - **Endpoint:** `GET /characters/inventory/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Fetches the inventory items of the specified character.
   - **Response:**
     - `200 OK`: Returns the inventory items.
     - `404 Not Found`: Character or inventory does not exist.

### 7. **Get Equipped Items**
   - **Endpoint:** `GET /characters/equipped/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Fetches the equipped items of the specified character.
   - **Response:**
     - `200 OK`: Returns the equipped items.
     - `404 Not Found`: Character or equipped items do not exist.

---

## Items

### 1. **Create an Item**
   - **Endpoint:** `POST /items/create`
   - **Description:** Creates a new item.
   - **Body:**
     ```json
     {
       "name": "string",
       "price": "number",
       "stats": {
         "health": "number",
         "strength": "number"
       }
     }
     ```
   - **Response:**
     - `201 Created`: Item successfully created.

### 2. **Update an Item**
   - **Endpoint:** `PUT /items/update/:itemId`
   - **Description:** Updates an existing item.
   - **Body:**
     ```json
     {
       "name": "string",
       "price": "number",
       "stats": {
         "health": "number",
         "strength": "number"
       }
     }
     ```
   - **Response:**
     - `200 OK`: Item successfully updated.
     - `404 Not Found`: Item does not exist.

### 3. **Get All Items**
   - **Endpoint:** `GET /items/list`
   - **Description:** Fetches all available items.
   - **Response:**
     - `200 OK`: Returns the list of items.

### 4. **Get Item Details**
   - **Endpoint:** `GET /items/:itemId`
   - **Description:** Fetches details of a specific item.
   - **Response:**
     - `200 OK`: Returns item details.
     - `404 Not Found`: Item does not exist.

### 5. **Purchase an Item**
   - **Endpoint:** `POST /items/purchase/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Purchases an item for the specified character.
   - **Body:**
     ```json
     {
       "itemId": "number",
       "quantity": "number"
     }
     ```
   - **Response:**
     - `200 OK`: Item successfully purchased.
     - `404 Not Found`: Item or character does not exist.
     - `400 Bad Request`: Insufficient funds or invalid data.

### 6. **Sell an Item**
   - **Endpoint:** `POST /items/sell/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Sells an item from the specified character's inventory.
   - **Body:**
     ```json
     {
       "itemId": "number",
       "quantity": "number"
     }
     ```
   - **Response:**
     - `200 OK`: Item successfully sold.
     - `404 Not Found`: Item or character does not exist.
     - `400 Bad Request`: Insufficient quantity or invalid data.

### 7. **Equip an Item**
   - **Endpoint:** `POST /items/equip/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Equips an item to the specified character.
   - **Body:**
     ```json
     {
       "itemId": "number"
     }
     ```
   - **Response:**
     - `200 OK`: Item successfully equipped.
     - `400 Bad Request`: Item is already equipped.
     - `404 Not Found`: Item or character does not exist.

### 8. **Unequip an Item**
   - **Endpoint:** `POST /items/unequip/:characterId`
   - **Authentication:** Required (JWT)
   - **Description:** Unequips an item from the specified character.
   - **Body:**
     ```json
     {
       "itemId": "number"
     }
     ```
   - **Response:**
     - `200 OK`: Item successfully unequipped.
     - `404 Not Found`: Item or character does not exist.

---

## Error Handling
All endpoints return appropriate HTTP status codes based on the outcome of the request. In case of an error, a response will include a descriptive message and the relevant status code.

- **200 OK**: The request was successful.
- **201 Created**: The resource was successfully created.
- **400 Bad Request**: The request was invalid (e.g., missing required fields, invalid input).
- **401 Unauthorized**: The request requires user authentication.
- **403 Forbidden**: The user does not have permission to perform the action.
- **404 Not Found**: The requested resource does not exist.
- **500 Internal Server Error**: A server error occurred.

---

This should cover the key aspects of your API. Let me know if you need any additional sections or further adjustments!