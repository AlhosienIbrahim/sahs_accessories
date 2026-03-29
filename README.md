# Sahs Accessories Store
A simple school project E-commer website for tech accessories

## How to Setup

### Step 1 - Setup Database
1. Open MySQL on your computer
2. Implement all code in the database.sql file step by step

### Step 2 - Install All Packages (one time only)
Open two terminal in the root folder and run:
first terminal:
```
cd Backend
npm run start
```
This will start backend
- Backend runs on: http://localhost:5000
second terminal:
```
cd frontend
npm start
```
This wil start frontend
- Frontend opens on: http://localhost:3000

> If you have a MySQL password, open backend/server.js and change the password field.

## Project Files
```
sahs-accessories/
├── frontend/              <- React app
│   ├── public/
│   │   ├── images/        <- products images
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Products.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── About.jsx
│       │   └── Contact.jsx
│       ├── App.jsx
│       └── App.css
├── backend/
│   ├── server.js           <- Express server
│   └── package.json
├── database.sql            <- MySQL setup
└── README.md
```

## Technologies Used
- React (frontend)
- Bootstrap 5 (styling)
- Node.js + Express (backend)
- MySQL (database)
- concurrently (to run both together)