# Frolic 2025 - Event Management System 🚀

A state-of-the-art, premium event management platform built for technical and cultural symposiums. This project features a high-end **React** frontend and a robust **Node.js** backend, providing a seamless experience for students, coordinators, and administrators.

---

## ✨ Features

### 👤 User Interface
- **Premium Aesthetics**: Stunning glassmorphism design with backdrop blurs, gradients, and subtle micro-animations.
- **Dynamic Dashboard**: Live statistics showing active events, registered participants, and upcoming dates.
- **Departmental Filtering**: Browse events by department with smooth transitions and real-time filtering.
- **Public Registration**: Students can register for events directly from the dashboard without mandatory login (can also be auth-linked).
- **Interactive Event Cards**: Quick access to event details and registration forms.

### 🔐 Admin Suite
- **Comprehensive Registry**: A master "Participant Registry" page to monitor every registered student across all events.
- **Data Management**: Dedicated tools to Create, Read, and Delete Institutes, Departments, and Events.
- **Live Search & Sort**: Advanced filtering and sorting capabilities on the administrative management tables.
- **CSV Export**: One-click functionality to download the entire participant database for local reporting.
- **Role-Based Access**: Secured routes and middleware ensuring only authorized personnel can manage the fest's infrastructure.

### ⚙️ Technical Brilliance
- **Deep Population**: Utilizes Mongoose deep population logic to perfectly link Participants → Groups → Events → Departments → Institutes.
- **Real-time Synchronization**: Frontend and Backend are perfectly synced to reflect registrations and counts instantly.
- **Secure Persistence**: JWT-based authentication stored in HttpOnly cookies for a secure, persistent session.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: `React 19` (Vite 7)
- **Styling**: `Tailwind CSS 3.4` (Custom Glassmorphism system)
- **Icons**: `Lucide React`
- **Routing**: `React Router Dom 7`
- **API Client**: `Axios`

### Backend
- **Platform**: `Node.js`
- **Framework**: `Express 5`
- **Database**: `MongoDB` (Mongoose 9)
- **Security**: `JSON Web Tokens (JWT)`, `BcryptJS`, `Cookie-Parser`
- **Dev Tooling**: `Nodemon`

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18 or higher.
- **MongoDB**: A running local instance or a cloud URI (Atlas).

### 1. Installation

Clone the project and install the dependencies for both directories:

```bash
# Set up Backend
cd Backend
npm install

# Set up Frontend
cd ../my-react-app
npm install
```

### 2. Environment Variables

Create a `.env` file in the `Backend` directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=3000
NODE_ENV=development
```

### 3. Launching the App

Start the development servers for both environments:

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd my-react-app
npm run dev
```

---

## 📂 Project Architecture

```plaintext
├── /Backend
│   ├── /models       # Mongoose Schemas (Institute, Event, Participant, etc.)
│   ├── /routes       # API Endpoints (Auth, Participants, Events)
│   ├── /middleware   # Auth guards and validation
│   └── server.js     # Express application entry point
│
├── /my-react-app
│   ├── /src
│   │   ├── /components # Reusable UI (Forms, Navbar, Modal)
│   │   ├── /pages      # Main Views (Dashboard, Admin Registry, Events)
│   │   ├── /services   # Axios API service layer
│   │   ├── /context    # Global Auth State
│   │   └── App.jsx     # Main Routing & App Logic
│   └── tailwind.config.js
```

---

## 🛡️ Administrative Functionality

- **Dashboard**: `http://localhost:5173/admin/dashboard`
- **Participant Registry**: `http://localhost:5173/admin/participants` (View/Search/Export/Delete)
- **Manage Tools**: `http://localhost:5173/admin/manage` (Institutes/Departments/Events/Participants tabs)

---

## 📄 License

This project is licensed under the **ISC License**. Built for the ultimate symposium experience.
