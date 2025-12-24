# 🤝 Collab Board – Frontend

A **real-time collaborative whiteboard** built with **React** and **Socket.IO**, allowing multiple users to join a room and draw together on a shared canvas with instant synchronization.

---

## 🌐 Live Demo

🔗 https://collab-board-frontend-opgs.onrender.com  

---
## ✨ Features

- 🎨 Real-time collaborative drawing  
- 👥 Multiple users in the same room  
- 🔄 Live canvas sync using WebSockets  
- 🧠 Room-based session management  
- ⚡ Fast, responsive UI  
- 📱 Works across devices  

---

## 🛠️ Tech Stack

- **React.js**
- **JavaScript**
- **Tailwind CSS**
- **Socket.IO (Client)**
- **WebSockets**
- **Node.js**
- **Render** (Deployment)

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/harshasharma21/COLLAB_BOARD_FRONTEND.git
cd COLLAB_BOARD_FRONTEND
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables
Create a .env file in the root directory:
```bash
REACT_APP_SOCKET_SERVER_URL=http://localhost:5000
```

### 4. Start the development server

```bash
npm start
```

The application will run at:

```bash
http://localhost:3000
```

## 📁 Project Structure

```text
COLLAB_BOARD_FRONTEND/
├── public/
│   └── index.html
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages / views
│   ├── utils/           # Helper functions and utilities
│   ├── styles/          # Global and component styles
│   ├── App.js           # Root React component
│   ├── index.js         # Application entry point
│   └── main.jsx         # App bootstrap (if using Vite)
├── .env                 # Environment variables
├── package.json         # Project dependencies & scripts
├── README.md            # Project documentation
└── .gitignore           # Ignored files
```

## 🤝 Contribution

Contributions are welcome and appreciated!

### How to Contribute

1. Fork the repository  
2. Create a new branch  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Commit your changes with a clear message
   ```bash
   git commit -m "Add: meaningful description of changes"
   ```
5. Push your branch to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request


## 👨‍💻 Author

**Sriharsha Sharma Japala**  
📧 Email: jsriharshasharma@gmail.com  
🔗 GitHub: https://github.com/harshasharma21

