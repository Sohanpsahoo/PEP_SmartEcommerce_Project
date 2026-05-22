<![CDATA[<div align="center">

# 🛒 SmartStore AI — Intelligent E-Commerce Management Platform

**An AI-powered e-commerce dashboard that helps store owners manage products, track orders, analyze revenue, and get actionable business insights — all in one place.**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

</div>

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About The Project

**SmartStore AI** is a full-stack, AI-enhanced e-commerce management dashboard built for store owners and small businesses. Instead of juggling multiple tools, SmartStore gives you a single, beautiful interface to:

- **Manage your product catalog** with AI-generated descriptions, SEO tags, and marketing captions.
- **Track orders** with detailed customer info, status updates, and item-level breakdown.
- **Monitor revenue** with interactive charts and monthly breakdowns.
- **Chat with an AI assistant** that understands your store data and provides real-time business insights.
- **View smart analytics** including pricing recommendations, inventory alerts, and trending product analysis.

When a new user signs up, the platform automatically seeds realistic dummy data (products, orders, and revenue entries) so the dashboard is immediately populated and ready to explore.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
| Feature | Description |
|---|---|
| **Smart Product Copywriting** | Automatically generates compelling product descriptions, SEO tags, and social media captions using Google Gemini AI. |
| **AI Chat Assistant** | A conversational chatbot that analyzes your entire store — products, orders, revenue — and answers business questions in real time. |
| **Business Insights Engine** | AI-driven pricing recommendations, inventory alerts (low-stock warnings), and trending product analysis. |
| **Multi-Model Fallback** | Automatically cycles through `gemini-2.0-flash` → `gemini-1.5-pro` → `gemini-1.5-flash` if any model hits a rate limit or goes down. |

### 📊 Dashboard & Analytics
- **Real-time KPI Cards** — Total Revenue, Total Products, Total Orders, and Units Sold at a glance.
- **Interactive Revenue Chart** — Beautiful gradient-filled line chart with monthly revenue trends.
- **Top Performing Products** — Ranked list of your best-selling products by revenue.
- **AI Insights Sidebar** — Live pricing, inventory, and trending recommendations powered by Gemini.

### 📦 Product Management
- Full CRUD operations (Create, Read, Update, Delete).
- AI-generated descriptions and SEO tags on product creation.
- Stock tracking with low-stock alerts.
- Sales data (units sold & revenue) per product.

### 🛍️ Order Management
- Add orders manually with customer details, multiple items, quantities, and pricing.
- Order status tracking: `Processing` → `Shipped` → `Delivered` → `Cancelled`.
- Auto-generated unique Order IDs.
- Full item-level breakdown with product references.

### 💰 Revenue Tracking
- Monthly revenue entries with notes.
- Interactive charts with gradient fills.
- Year-over-year tracking support.

### 👤 User Authentication & Profile
- Secure JWT-based authentication (signup/login).
- Password hashing with bcrypt.
- Profile management (update name, change password).
- Account stats overview (products, units sold, revenue).

### 🎨 Premium UI/UX
- Dark-themed glassmorphism design.
- Smooth micro-animations and hover effects.
- Fully responsive layout (mobile, tablet, desktop).
- Split-screen login/signup pages with feature highlights.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Chart.js + react-chartjs-2** | Interactive charts |
| **React Icons (Feather)** | Icon library |
| **Axios** | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB Atlas + Mongoose 9** | Cloud database & ODM |
| **Google Generative AI SDK** | Gemini AI integration |
| **JSON Web Tokens (JWT)** | Authentication |
| **bcrypt** | Password hashing |
| **dotenv** | Environment variable management |

---

## 📁 Project Architecture

```
PEP_Final_Project/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                  # User schema (name, email, password)
│   │   ├── Product.js               # Product schema (name, price, stock, salesData)
│   │   ├── Order.js                 # Order schema (customer, items, status)
│   │   └── Revenue.js               # Revenue schema (month, year, amount)
│   ├── routes/
│   │   ├── authRoutes.js            # Signup, login, profile + dummy data seeding
│   │   ├── productRoutes.js         # Product CRUD operations
│   │   ├── orderRoutes.js           # Order CRUD operations
│   │   ├── revenueRoutes.js         # Revenue CRUD operations
│   │   ├── aiRoutes.js              # AI content generation, insights, chat
│   │   └── analyticsRoutes.js       # Dashboard analytics aggregation
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   └── .env                         # Environment variables (not committed)
│
├── frontend/
│   ├── public/
│   │   └── _redirects               # Netlify/Render SPA routing fallback
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Main app layout with sidebar
│   │   │   └── ChatWidget.jsx       # Floating AI chat assistant
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main dashboard with KPIs & charts
│   │   │   ├── Products.jsx         # Product management page
│   │   │   ├── Orders.jsx           # Order management page
│   │   │   ├── Revenue.jsx          # Revenue tracking page
│   │   │   ├── Insights.jsx         # AI business insights page
│   │   │   ├── Profile.jsx          # User profile & settings
│   │   │   ├── Login.jsx            # Login page (split-screen design)
│   │   │   └── Signup.jsx           # Signup page (split-screen design)
│   │   ├── App.jsx                  # React Router configuration
│   │   ├── main.jsx                 # App entry point + axios config
│   │   └── index.css                # Global styles & design tokens
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB Atlas** account (free tier works) — [Sign Up](https://www.mongodb.com/cloud/atlas)
- **Google Gemini API Key** — [Get API Key](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sohanpsahoo/PEP_SmartEcommerce_Project.git
   cd PEP_SmartEcommerce_Project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables** (see section below)

5. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   The server will start on `http://localhost:5000`.

6. **Start the frontend dev server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The app will open at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |

> **Note:** For the frontend deployment, you also need to set `VITE_API_URL` as an environment variable pointing to your deployed backend URL.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user (+ seeds dummy data) |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/profile` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update name or password |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | Get all orders |
| `POST` | `/api/orders` | Create a new order |
| `PUT` | `/api/orders/:id` | Update order status |
| `DELETE` | `/api/orders/:id` | Delete an order |

### Revenue
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/revenue` | Get all revenue entries |
| `POST` | `/api/revenue` | Add a revenue entry |
| `DELETE` | `/api/revenue/:id` | Delete a revenue entry |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/generate-content` | Generate product description, SEO tags & marketing caption |
| `GET` | `/api/ai/insights` | Get AI-driven business insights |
| `POST` | `/api/ai/chat` | Chat with the AI assistant |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/dashboard` | Get aggregated dashboard stats |

---

## 🌐 Deployment

### Deploy on Render (Recommended)

#### Backend (Web Service)
1. Go to [Render.com](https://render.com) → **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`).
7. Click **Create Web Service**.

#### Frontend (Static Site)
1. Go to Render → **New +** → **Static Site**.
2. Connect the same GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Set **Build Command** to `npm install && npm run build`.
5. Set **Publish Directory** to `dist`.
6. Add environment variable: `VITE_API_URL` = `<your-backend-render-url>`.
7. Add a **Rewrite Rule**: Source `/*` → Destination `/index.html` → Action `Rewrite`.
8. Click **Create Static Site**.

---

## 🖼️ Screenshots

> _Screenshots coming soon! Deploy the application and explore the beautiful dashboard, AI chat assistant, and product management pages._

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve SmartStore AI:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Sohan Prasad Sahoo](https://github.com/Sohanpsahoo)**

⭐ Star this repository if you found it helpful!

</div>
]]>
