# 🛫 SkyFlow Flights & Search Service

[![Production Search Service](https://img.shields.io/badge/Production-Live%20on%20Render-success?style=for-the-badge&logo=render)](https://skyflow-search-service.onrender.com/health)
[![Node.js](https://img.shields.io/badge/Node.js-v18.0.0+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.0-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Sequelize ORM](https://img.shields.io/badge/Sequelize-v6.0-52B0E7?style=for-the-badge&logo=sequelize)](https://sequelize.org/)
[![Redis Cache](https://img.shields.io/badge/Redis-In--Memory%20Cache-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Multi--Dialect-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

The **SkyFlow Flights and Search Service** is the central catalog and real-time inventory management microservice of the platform. It handles the lifecycle of aviation cities, airport hubs, aircraft fleets, and scheduled flight itineraries. It supports multi-criteria flight queries, in-memory caching via Redis with resilient fallback, and transactional seat inventory updates called by the **Booking Service**.

---

## 🏗️ System Architecture & Service Context

The Flights & Search Service interfaces with both upstream clients (via the API Gateway) and internal peer services (the Booking Service for seat reservations and cancellations).

```mermaid
flowchart TD
    GW(["SkyFlow API Gateway (:3005)"])
    BookingSvc(["Airline Booking Service (:3002)"])

    subgraph SearchServiceBoundary ["Flights & Search Service (:3000 / Render)"]
        Routes["Express Router (/api/v1)"]

        subgraph Interceptors ["Security & Validation"]
            InternalAuth["Internal Service Auth Guard<br/>• Validates x-service-token for PATCH /flights"]
            FlightValidator["Flight Creation Validator<br/>• Verifies times, airport IDs, & fleet capacity"]
        end

        subgraph ControllersLayer ["Controllers & Handlers"]
            FlightCtrl["Flight Controller"]
            CityCtrl["City Controller"]
            AirportCtrl["Airport Controller"]
        end

        subgraph ServicesLayer ["Domain Business Services"]
            FlightSvc["Flight Service<br/>• Pricing Computation<br/>• Inventory Allocation & Deductions<br/>• Query Filtering (Price, Dates, Hubs)"]
            CitySvc["City Service"]
            AirportSvc["Airport Service"]
        end

        subgraph CacheLayer ["Caching Subsystem"]
            RedisClient[("Redis In-Memory Cache<br/>• Cached Flight Catalogs<br/>• Graceful Fallback if Disconnected")]
        end

        subgraph DataAccessLayer ["Sequelize Repository Layer"]
            FlightRepo["Flight Repository"]
            CityRepo["City Repository"]
            AirportRepo["Airport Repository"]
            AirplaneRepo["Airplane Repository"]
        end
    end

    subgraph RelationalStore ["Relational Database (PostgreSQL / MySQL)"]
        CitiesTable[("Cities Table")]
        AirportsTable[("Airports Table")]
        AirplanesTable[("Airplanes Table")]
        FlightsTable[("Flights Table")]
    end

    GW -->|GET /flights, /city, /airports (Public Search)| Routes
    GW -->|POST /flights (Admin Schedule Dispatch)| Routes
    BookingSvc -->|GET /flights/:id (Price & Seat Verification)| Routes
    BookingSvc -->|PATCH /flights/:id with x-service-token (Seat Saga Deduct/Restock)| Routes

    Routes --> Interceptors
    Interceptors --> ControllersLayer
    ControllersLayer --> ServicesLayer
    ServicesLayer <--> CacheLayer
    ServicesLayer --> DataAccessLayer
    DataAccessLayer <--> RelationalStore

    classDef clientStyle fill:#1e1b4b,stroke:#8b5cf6,stroke-width:2px,color:#f8fafc;
    classDef svcStyle fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef dbStyle fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#f8fafc;

    class GW,BookingSvc clientStyle;
    class SearchServiceBoundary,Routes,Interceptors,ControllersLayer,ServicesLayer,CacheLayer,DataAccessLayer svcStyle;
    class RelationalStore,CitiesTable,AirportsTable,AirplanesTable,FlightsTable dbStyle;
```

---

## 📊 Database Domain Model (ER Diagram)

The flight catalog domain enforces relational integrity between cities, airports, aircraft fleets, and scheduled flight legs:

```mermaid
erDiagram
    CITY ||--o{ AIRPORT : "located in"
    AIRPORT ||--o{ FLIGHT : "departure airport"
    AIRPORT ||--o{ FLIGHT : "arrival airport"
    AIRPLANE ||--o{ FLIGHT : "assigned aircraft"

    CITY {
        int id PK "Auto Increment"
        string name "City Name (e.g. Delhi, Mumbai)"
        datetime createdAt
        datetime updatedAt
    }

    AIRPORT {
        int id PK "Auto Increment"
        string name "Airport Hub Name"
        string address "Address / Terminal Location"
        int cityId FK "References Cities(id)"
        datetime createdAt
        datetime updatedAt
    }

    AIRPLANE {
        int id PK "Auto Increment"
        string modelNumber "e.g. Airbus A320neo, Boeing 737 Max"
        int capacity "Total Seat Capacity (e.g. 180)"
        datetime createdAt
        datetime updatedAt
    }

    FLIGHT {
        int id PK "Auto Increment"
        string flightNumber "e.g. AI-999, UK-888"
        int airplaneId FK "References Airplanes(id)"
        int departureAirportId FK "References Airports(id)"
        int arrivalAirportId FK "References Airports(id)"
        datetime departureTime "Scheduled Departure"
        datetime arrivalTime "Scheduled Arrival"
        int price "Base Airfare (INR)"
        int totalSeats "Live Remaining Seat Inventory"
        datetime createdAt
        datetime updatedAt
    }
```

---

## ⚡ Core Capabilities

1. **Multi-Parametric Flight Querying**:
   - Supports filter combinations: `departureAirportId`, `arrivalAirportId`, `minPrice`, `maxPrice`, and `date`.
   - Dynamic sorting via Sequelize query building.
2. **In-Memory Caching with Graceful Degradation**:
   - High-throughput Redis caching for flight lookups. If Redis is unavailable or unconfigured, the service operates seamlessly with direct relational database fallback.
3. **Internal Inter-Service Authentication Guard**:
   - The `PATCH /api/v1/flights/:id` endpoint adjusts live seat inventories and is guarded by `InternalAuthMiddleware` requiring an `x-service-token` secret header.
4. **Relational Multi-Dialect Compatibility**:
   - Fully compatible with local MySQL development and production-grade cloud PostgreSQL (Render) with SSL negotiation.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | Server execution runtime |
| **Framework** | Express 5 | REST API web framework |
| **ORM** | Sequelize v6 | Relational Object-Relational Mapping |
| **Cache** | Redis (`ioredis` / `redis`) | High-speed cache for catalog lookups |
| **Databases** | PostgreSQL & MySQL | Relational engines via `pg` and `mysql2` |
| **Security** | Internal Token Middleware | Shared-secret service-to-service authorization |

---

## 🌐 API Endpoints & Request Contract

### 1. Search Flights
- **Endpoint**: `GET /api/v1/flights`
- **Access**: Public
- **Query Parameters**:
  - `departureAirportId` *(optional)*: Airport ID
  - `arrivalAirportId` *(optional)*: Airport ID
  - `minPrice` / `maxPrice` *(optional)*: Budget boundaries
  - `date` *(optional)*: Filter by travel date (`YYYY-MM-DD`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Successfully fetched the flights",
    "data": [
      {
        "id": 1,
        "flightNumber": "AI-999",
        "airplaneId": 1,
        "departureAirportId": 1,
        "arrivalAirportId": 2,
        "arrivalTime": "2026-10-30T12:15:00.000Z",
        "departureTime": "2026-10-30T10:00:00.000Z",
        "price": 5600,
        "totalSeats": 178
      }
    ],
    "err": {}
  }
  ```

### 2. Get Single Flight Details
- **Endpoint**: `GET /api/v1/flights/:id`
- **Access**: Public / Inter-Service
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Successfully fetched the flight",
    "data": {
      "id": 1,
      "flightNumber": "AI-999",
      "price": 5600,
      "totalSeats": 178
    },
    "err": {}
  }
  ```

### 3. Schedule / Dispatch New Flight (Admin)
- **Endpoint**: `POST /api/v1/flights`
- **Access**: Protected (Requires `ADMIN` role via API Gateway)
- **Request Body**:
  ```json
  {
    "flightNumber": "UK-888",
    "airplaneId": 1,
    "departureAirportId": 1,
    "arrivalAirportId": 2,
    "departureTime": "2026-10-31T11:00:00.000Z",
    "arrivalTime": "2026-10-31T13:15:00.000Z",
    "price": 6200
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Successfully created a flight",
    "data": { "id": 2, "flightNumber": "UK-888", "totalSeats": 180 },
    "err": {}
  }
  ```

### 4. Update Flight Inventory (Internal Service Token)
- **Endpoint**: `PATCH /api/v1/flights/:id`
- **Access**: Internal (Requires `x-service-token`)
- **Headers**: `x-service-token: <INTERNAL_SERVICE_KEY>`
- **Request Body**:
  ```json
  {
    "totalSeats": 178
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Successfully updated the flight",
    "data": { "id": 1, "totalSeats": 178 },
    "err": {}
  }
  ```

### 5. Airports & Cities Catalog
- **Get Cities**: `GET /api/v1/city`
- **Get Airports**: `GET /api/v1/airports`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Successfully fetched all cities/airports",
    "data": [
      { "id": 1, "name": "Delhi", "createdAt": "..." }
    ]
  }
  ```

### 6. Health Probe
- **Endpoint**: `GET /health`
- **Response** (`200 OK`):
  ```json
  {
    "service": "Airline-Search-Service-",
    "status": "UP",
    "database": "CONNECTED",
    "cache": "DISCONNECTED",
    "timestamp": "2026-10-13T06:09:24.970Z"
  }
  ```

---

## ⚙️ Environment Variables

Create a `.env` file in `Airline-Search-Service-`:

| Variable | Required | Default / Example | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | **Yes** | `3000` (Local) / `10000` (Render) | Server listening port. |
| `DATABASE_URL` | Optional | `postgres://user:pass@host/db` | Connection URI for cloud databases (Render PostgreSQL). |
| `REDIS_URL` | Optional | `redis://localhost:6379` | Connection URI for Redis in-memory cache. |
| `INTERNAL_SERVICE_KEY` | Optional | `airline-internal-secret` | Shared secret token validating calls from Booking Service. |
| `SYNC_DB` | Optional | `false` | When set to `true`, auto-syncs models on startup. |
| `NODE_ENV` | Optional | `development` | Operating environment (`development`, `production`). |

---

## 🚀 Local Development & Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MySQL**: Running on `127.0.0.1:3306` (or PostgreSQL)
- **Redis**: Running on `127.0.0.1:6379` (optional)

### Step-by-Step Instructions

1. **Navigate to Service:**
   ```bash
   cd Airline-Search-Service-
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment & Database:**
   ```bash
   cp .env.example .env
   cp src/config/config.json.example src/config/config.json
   ```

4. **Apply Schema Migrations & Seed Aviation Data:**
   ```bash
   npx sequelize db:create
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

5. **Start Service:**
   ```bash
   npm start
   ```
   Service will listen on `http://localhost:3000`.

---

## 🐳 Docker Setup

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . ./
EXPOSE 3000
CMD ["node", "src/index.js"]
```

```bash
docker build -t skyflow-search-service .
docker run -p 3000:3000 --env-file .env skyflow-search-service
```

---

## 📄 License
This project is licensed under the MIT License.
