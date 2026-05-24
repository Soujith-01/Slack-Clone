# Slack-Clone Frontend

This is the Frontend for a Slack-like real-time chat application built with **React** and **Vite**. It provides a modern, fast, and feature-rich interface for team communication, channels, and direct messages.

## Features

- **Authentication**
  - Login and registration with support for Google OAuth.
  - Persistent session management and user state using Zustand.
- **Real-Time Messaging**
  - Channels (group chat) and Direct Messages (DM).
  - Instant updates via socket.io for new messages and unread indicators.
  - Customizable workspace with channel creation/joining; channel member management.
- **User Profile & Preferences**
  - View and edit user profile.
- **Responsive Modern UI**
  - Stylish dark theme using Tailwind CSS and Lucide icons.
  - Popups for inviting users and managing channels.
  - Interactive chat sidebar and detailed chat window layout.
- **Settings**
  - Manage account and preferences through a dedicated settings page.

## Tech Stack & Main Packages

- **React** (`react`, `react-dom`) — core UI library.
- **Vite** — blazingly fast build tool for development.
- **Tailwind CSS** (`tailwindcss`, `@tailwindcss/vite`) — utility-first styling.
- **Zustand** — lightweight state management, especially for auth state.
- **socket.io-client** — real-time bidirectional communication.
- **React Router** (`react-router`, `react-router-dom`) — declarative routing in SPA.
- **axios** — HTTP client for API integration.
- **reactjs-popup** — popups for inviting users, creating/searching channels.
- **lucide-react** — SVG icon library.
- **react-hot-toast** — toast notifications.
- **react-hook-form** — elegant form validation.
- **dotenv** — use environment variables.

## Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── channels/
│   │   │   ├── Channels.jsx
│   │   │   └── DMs.jsx
│   │   ├── chat/
│   │   │   ├── Chat.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── FileTransfer.jsx
│   │   │   ├── MessageContainer.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageSender.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── ThreadPanel.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── RootLayout.jsx
│   │   │   └── SideBar.jsx
│   │   └── profile/
│   │       ├── settings/
│   │       │   ├── ProfileSettings.jsx
│   │       │   └── SecuritySettings.jsx
│   │       ├── Settings.jsx
│   │       └── UserProfile.jsx
│   ├── store/
│   │   └── authStore.js
│   ├── styles/
│   │   └── common.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── socket.js
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Customization

- API endpoints are configurable via `.env` and `VITE_BACKEND_URL`.
- Tailwind CSS config is in `tailwind.config.js`.
- Modify channels, DMs, and authentication logic in their respective components in `src/components`.
