# Slack Clone Backend

This is the backend API and real-time server for a **Slack-inspired chat application**, providing user authentication, channel and DM management, messaging (with threads and reactions), file sharing, and real-time updates via Socket.IO. Built with **Node.js, Express, MongoDB, and Socket.IO**.

---

## Features

- **User Authentication**: JWT, cookies, Google OAuth, account deactivation/reactivation, password/security management.
- **Channels & DMs**: Create/join channels, manage membership, direct (private) messages, channel invitations and join requests.
- **Messaging**: Send, edit, delete messages; message threads; reactions (emoji); and notifications.
- **File Uploads**: Upload single or multiple files (images, docs, audio, video, etc.) via Cloudinary; download and delete support.
- **Preferences & Notifications**: Per-user settings for appearance and notifications.
- **Real-time**: Uses Socket.IO for instant messaging and live updates.
- **Mongoose ODM**: MongoDB for storage with schema validation.

---

## Tech Stack

- **Node.js** & **Express** (REST API, server)
- **Socket.IO** (real-time communication)
- **MongoDB** and **Mongoose** (database)
- **JWT** authentication & cookie parser
- **Multer** (file uploads), **Cloudinary** (file/media hosting)
- **Passport / Google OAuth**
- **dotenv** (config), **CORS**

---

## API Endpoints

### User

- `POST /user-api/users` — Register with email/password (+ optional profile image)
- `POST /user-api/login` — Login and receive JWT cookie
- `POST /user-api/activate-account` — Reactivate a deactivated account
- `GET /user-api/logout` — Logout (clears cookie)
- `PUT /user-api/users` — Update profile & password (JWT protected)
- `DELETE /user-api/delete-user` — Deactivate account

- `POST /user-api/logout-all` — Invalidate tokens on all devices
- `GET /user-api/check-auth` — Verify/refresh authentication status

### Channel & Direct Message (DM)

- `POST /chat-api/chats/channel` — Create a new channel
- `GET /chat-api/chats/channels` — List channels the user belongs to
- `POST /chat-api/chats/dm` — Start a DM with another user
- `GET /chat-api/chats/dms` — List all DMs

- Membership management: add/invite/remove members, join/leave channels, handle join/invite requests.

### Messaging

- `GET /message-api/get-channel/:chatId` — Get messages in a channel
- `GET /message-api/get-dm/:chatId` — Get messages in a DM
- `POST /message-api/thread` — Reply to a message/thread
- `GET /message-api/thread/:messageId` — Fetch thread replies
- `PATCH /message-api/edit` — Edit message (sender only)
- `DELETE /message-api/delete` — Delete message (sender only)
- `POST /message-api/react` — React/toggle reaction on a message

### File Transfer

- `POST /fileTransfer-api/` — Upload a single file (20MB limit)
- `POST /fileTransfer-api/multiple` — Upload up to 5 files at once
- `DELETE /fileTransfer-api/:public_id` — Delete uploaded file

### Google OAuth

- `POST /auth/google` (and related endpoints) — Google-based login/signup

---

## Real-time Events (Socket.IO)

- Automatically set up on server start. Client connects for messaging, typing indicators, etc.
- **See `Backend/sockets/socket.js`** for full socket event details.

---

## Folder Structure

- `server.js` — Main entry point
- `APIs/` — Route handlers for User, Channel, Message, File Upload, Google OAuth
- `models/` — Mongoose models
- `middlewares/` — Authentication & error middlewares
- `sockets/` — Real-time event logic
- `config/` — Multer and Cloudinary setup

---

## Dependencies

See [`package.json`](./package.json) for full list. Key packages:

- express, mongoose, socket.io, bcrypt/bcryptjs, jsonwebtoken,
- multer, cloudinary, dotenv, cors, cookie-parser,
- passport, passport-google-oauth20
