# 🛒 SmartStore AI

### Intelligent E-Commerce Management Platform

> An AI-powered dashboard that helps store owners manage products, track orders, analyze revenue, and get actionable business insights — all in one place.

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI_Powered-4285F4?style=flat-square&logo=google&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 📌 What is SmartStore AI?

SmartStore AI is a full-stack e-commerce management dashboard designed for store owners and small businesses. It combines traditional store management with Google Gemini AI to provide:

- **AI-generated product descriptions**, SEO tags, and marketing captions
- **Smart business insights** — pricing recommendations, inventory alerts, trending analysis
- **Conversational AI chatbot** that understands your entire store data
- **Beautiful dark-themed dashboard** with real-time KPIs and interactive charts
- **Complete CRUD** for products, orders, and revenue — all stored in MongoDB

New accounts are automatically seeded with sample data so the dashboard looks great from day one.

---

## ✨ Features at a Glance

| Category | What You Get |
|----------|-------------|
| 🤖 **AI Copywriting** | Auto-generate product descriptions, SEO tags & social captions |
| 💬 **AI Chat Assistant** | Ask questions about your sales, revenue, products in natural language |
| 📊 **Live Dashboard** | KPI cards, revenue charts, top products, AI insights sidebar |
| 📦 **Product Management** | Add/edit/delete products with stock tracking & sales data |
| 🛍️ **Order Management** | Manual order entry with customer details, items & status tracking |
| 💰 **Revenue Tracking** | Monthly entries with notes, interactive gradient charts |
| 🔐 **Auth & Security** | JWT authentication, bcrypt password hashing, profile management |
| 🎨 **Premium UI** | Glassmorphism dark theme, micro-animations, fully responsive |
| 🔄 **AI Fallback** | Auto-switches between Gemini models if one hits rate limits |

---

## 🛠️ Tech Stack

**Frontend:** React 19 · Vite 8 · Tailwind CSS 4 · React Router v7 · Chart.js · Axios

**Backend:** Node.js · Express 5 · MongoDB Atlas · Mongoose 9 · Google Generative AI SDK · JWT · bcrypt

---

## 📁 Project Structure

```
SmartStore AI/
│
├── backend/
│   ├── middleware/authMiddleware.js    # JWT auth guard
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── Product.js                 # Product schema with salesData
│   │   ├── Order.js                   # Order schema with items
│   │   └── Revenue.js                 # Monthly revenue schema
│   ├── routes/
│   │   ├── authRoutes.js              # Auth + dummy data seeding
│   │   ├── productRoutes.js           # Product CRUD
│   │   ├── orderRoutes.js             # Order CRUD
│   │   ├── revenueRoutes.js           # Revenue CRUD
│   │   ├── aiRoutes.js                # AI generation, insights, chat
│   │   └── analyticsRoutes.js         # Dashboard stats
│   └── server.js                      # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx             # Sidebar layout
│   │   │   └── ChatWidget.jsx         # Floating AI chat
│   │   ├── context/AuthContext.jsx     # Auth state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Main dashboard
│   │   │   ├── Products.jsx           # Product management
│   │   │   ├── Orders.jsx             # Order management
│   │   │   ├── Revenue.jsx            # Revenue tracking
│   │   │   ├── Insights.jsx           # AI insights
│   │   │   ├── Profile.jsx            # User profile
│   │   │   ├── Login.jsx              # Login page
│   │   │   └── Signup.jsx             # Signup page
│   │   ├── App.jsx                    # Router config
│   │   └── main.jsx                   # Entry point
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- [Google Gemini API Key](https://ai.google.dev/)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Sohanpsahoo/PEP_SmartEcommerce_Project.git
cd PEP_SmartEcommerce_Project

# 2. Setup backend
cd backend
npm install

# 3. Create backend/.env file with:
#    MONGO_URI=your_mongodb_connection_string
#    JWT_SECRET=your_secret_key
#    GEMINI_API_KEY=your_gemini_api_key

# 4. Start backend (runs on port 5000)
npm start

# 5. In a new terminal, setup frontend
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📡 API Reference

### Auth
```
POST   /api/auth/signup      →  Register (auto-seeds dummy data)
POST   /api/auth/login       →  Login & get JWT
GET    /api/auth/profile     →  Get profile
PUT    /api/auth/profile     →  Update name/password
```

### Products
```
GET    /api/products          →  List all products
POST   /api/products          →  Create product
PUT    /api/products/:id      →  Update product
DELETE /api/products/:id      →  Delete product
```

### Orders
```
GET    /api/orders            →  List all orders
POST   /api/orders            →  Create order
PUT    /api/orders/:id        →  Update order status
DELETE /api/orders/:id        →  Delete order
```

### Revenue
```
GET    /api/revenue           →  List all entries
POST   /api/revenue           →  Add entry
DELETE /api/revenue/:id       →  Delete entry
```

### AI
```
POST   /api/ai/generate-content  →  Generate description, SEO tags, caption
GET    /api/ai/insights           →  Get business insights
POST   /api/ai/chat               →  Chat with AI assistant
```

### Analytics
```
GET    /api/analytics/dashboard   →  Aggregated dashboard stats
```

---

## 🌐 Deployment (Render)

### Backend → Web Service

1. [Render.com](https://render.com) → **New+** → **Web Service**
2. Connect GitHub repo
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add env vars: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`
7. Deploy → Copy the live URL

### Frontend → Static Site

1. Render → **New+** → **Static Site**
2. Connect same repo
3. **Root Directory:** `frontend`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `dist`
6. Add env var: `VITE_API_URL` = your backend URL from above
7. Add rewrite rule: `/*` → `/index.html` (Action: Rewrite)
8. Deploy

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 License

Open source under the [MIT License](LICENSE).

---

**Built with ❤️ by [Sohan Priyadarshi Sahoo](https://github.com/Sohanpsahoo)**
