# 🚨 Women_SafetyAlert 🚨

![SafeAlert Banner](https://img.shields.io/badge/SafeAlert-Women%20Safety%20App-red?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=flat-square&logo=tailwindcss)

---

## 📌 Problem Statement

Women in India face safety risks in public spaces with **no quick, discreet way** to alert emergency contacts or nearby authorities during a dangerous situation. Existing solutions are either too complex, require internet connectivity, or lack a real-time response mechanism.

---

## 💡 Solution

**SafeAlert** is a full-stack real-time women safety and emergency response web application. It allows users to:

- Register and manage **trusted emergency contacts**
- Trigger **instant SOS alerts** with one click
- Share **live location** with registered contacts
- Log and browse **incident reports** in their area
- Access **safety resources** and helpline numbers

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Tailwind CSS            |
| Routing    | React Router DOM                  |
| State      | Redux Toolkit                     |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB (Mongoose ORM)            |
| Real-time  | Socket.io (optional)              |
| Auth       | LocalStorage-based Authentication |

---

## 🚀 Features

### 🔐 Authentication
- Signup / Login with input validation
- Password strength validation
- LocalStorage-based session handling
- Protected routes for authenticated users only

### 📇 Contact Management (CRUD)
- Add, view, update, delete trusted emergency contacts
- Each contact stores name, phone number, and relationship

### 🆘 SOS Alert System
- One-click SOS trigger from dashboard
- Sends alert with user's current GPS location to all registered contacts
- Alert history stored in MongoDB

### 🗺️ Incident Reports (CRUD)
- Users can report unsafe incidents with location, description, and date
- Browse all community-reported incidents
- Filter by location, date range, or incident type
- Debounced search for instant results
- Pagination for large datasets

### 📍 Safe Zones
- Mark and manage personal safe zones (home, college, office)
- Visual display of safe zones on the dashboard

### 🌐 Safety Resources
- Access national helplines (100, 1091, 112)
- Curated safety tips and emergency procedures

### 🎨 UI/UX
- Dark Mode / Light Mode toggle
- Theme preference persisted in LocalStorage
- Fully responsive across Desktop, Tablet, and Mobile
- Clean, minimal, and accessible UI

---

## ⚙️ React Hooks Used

| Hook         | Usage                                          |
|--------------|------------------------------------------------|
| `useState`   | Managing form inputs, toggle states            |
| `useEffect`  | API calls on mount, theme initialization       |
| `useRef`     | Focus management on forms, SOS button ref      |
| `useContext` | Global theme context sharing across components |

---



