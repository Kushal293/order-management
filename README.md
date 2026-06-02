# 🍽️ QuickBite — Order Management System

A full-stack food delivery order management application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO** for real-time order tracking.

## 🚀 Tech Stack

### Frontend
- **React 19** with Vite
- **TailwindCSS v4** for styling
- **Redux Toolkit** for state management
- **React Router v7** for navigation
- **Axios** for API communication
- **Socket.IO Client** for real-time updates
- **React Hot Toast** for notifications
- **Vitest + React Testing Library** for testing

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **Socket.IO** for WebSocket real-time communication
- **Express Validator** for input validation
- **Helmet** for security headers
- **Jest + Supertest** for API testing
- **MongoDB Memory Server** for test database

## 📋 Features

### Menu Display
- Browse food items across 5 categories (Pizza, Burger, Drink, Dessert, Side)
- Filter by category with animated tab navigation
- Each item shows name, description, price, and image

### Cart & Checkout
- Add/remove items with quantity controls
- Slide-out cart drawer with live totals
- Checkout form with real-time validation (name, address, phone)
- Server-side price calculation (prevents price tampering)

### Order Tracking
- Real-time order status updates via WebSocket
- Visual progress stepper (Order Received → Preparing → Out for Delivery → Delivered)
- Status history with timestamps
- Order cancellation support

### Backend API
- RESTful API design with proper HTTP methods and status codes
- Input validation with detailed error messages
- Server-side price calculation and menu item verification
- Status transition validation (can't skip statuses or go backwards)
- Paginated order listing with status filtering

## 🏗️ Architecture

```
order-task-raftlabs/
├── server/                    # Backend API
│   ├── src/
│   │   ├── config/            # DB & Socket.IO configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Validation & error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routes
│   │   ├── seeders/           # Database seed data
│   │   ├── services/          # Business logic (status simulation)
│   │   └── utils/             # Constants & helpers
│   ├── tests/                 # API tests (Jest + Supertest)
│   └── server.js              # Entry point
├── client/                    # Frontend SPA
│   ├── src/
│   │   ├── api/               # Axios API layer
│   │   ├── app/               # Redux store
│   │   ├── components/        # Reusable UI components
│   │   ├── features/          # Redux slices (menu, cart, order)
│   │   ├── hooks/             # Custom hooks (useSocket)
│   │   ├── pages/             # Page components
│   │   └── utils/             # Constants
│   └── tests/                 # Component & unit tests
└── package.json               # Root scripts
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** v18+
- **MongoDB** (via Docker or local installation)
- **npm** v9+

### 1. Clone & Install

```bash
git clone <repository-url>
cd order-task-raftlabs
npm run install:all
```

### 2. Start MongoDB (Docker)

```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 3. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env if needed (defaults work with local MongoDB)
```

### 4. Seed the Database

```bash
npm run seed
```

### 5. Run the Application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 🧪 Running Tests

```bash
# Run all tests (backend + frontend)
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client
```

## 📡 API Endpoints

### Menu
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/menu` | Get all available menu items |
| `GET` | `/api/menu?category=Pizza` | Filter by category |
| `GET` | `/api/menu/:id` | Get single menu item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | Get all orders (paginated) |
| `GET` | `/api/orders/:id` | Get order by ID |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `PATCH` | `/api/orders/:id/cancel` | Cancel an order |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | API health check |

## 🔌 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinOrder` | Client → Server | Subscribe to order updates |
| `leaveOrder` | Client → Server | Unsubscribe from order updates |
| `orderStatusUpdate` | Server → Client | Real-time status change notification |

## 🎨 Design Decisions

1. **Server-side price calculation**: Prevents price manipulation by computing totals from the database, not from client-submitted data.
2. **Status transition validation**: Orders follow a strict progression — status cannot be skipped or reversed.
3. **Socket.IO room-based updates**: Clients only receive updates for orders they're actively tracking, minimizing unnecessary data transfer.
4. **Redux Toolkit**: Provides a standardized, opinionated state management pattern with built-in async thunk support.
5. **Component composition**: UI is broken into small, reusable components for maintainability and testability.

## 📄 License

MIT
