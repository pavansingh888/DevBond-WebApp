# 🚀 DevBond — Frontend

DevBond is a full-stack social networking platform built using the MERN stack. This repository contains the **frontend application** built with **Vite + React**, styled using **Tailwind CSS** and **Daisy UI**, featuring real-time chat, profile management, social connections, and more.

---

## 🛠️ Tech Stack

- React (Vite)
- Tailwind CSS + Daisy UI
- React Router
- Redux Toolkit
- Axios
- Socket.IO Client

---

## 📦 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pavansingh888/DevBond-WebApp.git
cd devbond-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App Locally

```bash
npm run dev
```

---

## ✨ Key Features

- ✅ Hello World setup via Vite
- 🎨 Styled with Tailwind CSS + Daisy UI
- 🧭 Routing using React Router
- 🔐 Login, Signup & Protected Routes
- 📥 Axios API calls with `withCredentials: true`
- 🔄 Redux Toolkit for state management
- 🔔 Toast notifications on profile updates
- 🤝 Social Connection Requests (Send, Accept, Reject)
- 🧾 Feed with user cards
- ✍️ Edit Profile
- 🔄 Logout + Session Persistence
- 🔗 View Connections & Requests
- 💬 Real-time Chat via WebSockets
- 💰 Razorpay Integration for Premium Users
- 📧 Email Notifications using Amazon SES
- 📆 Scheduled Cron Jobs via Node for daily email reports

---

## 🧭 Routes Overview

```jsx
<BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed/>}></Route>
            <Route path="/chat/:targetUserId" element={<Chat/>}></Route>
            <Route path="/premium" element={<Premium/>}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/connections" element={<Connections />}></Route>
            <Route path="/requests" element={<Requests/>}></Route>
            <Route path="/error" element={<ErrorPage/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
```

---

## 🔒 Authentication Guard

- Unauthenticated users are redirected to `/login`.
- Token is required for accessing protected routes.

---

## 🧪 E2E Testing

Full end-to-end test cases are implemented to verify flows like:

- Signup
- Login
- Edit Profile
- Connection Requests
- Payment Flow
- Real-time Messaging

---

## 🚀 Deployment (Frontend on AWS EC2)

1. Build the project:

```bash
npm run build
```

2. Copy `dist` to EC2:

```bash
scp -r dist/* ubuntu@<your-ec2-ip>:/var/www/html/
```

3. Configure Nginx:

```nginx
server {
  listen 80;
  server_name DevBond.com;

  root /var/www/html;
  index index.html;

  location /api/ {
    proxy_pass http://localhost:7777/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

4. Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## 🌐 Domain Setup via Cloudflare

- Purchase domain (e.g. from GoDaddy)
- Point nameservers to Cloudflare

## 📧 Amazon SES for Emails

- Create IAM User with SES Access
- Setup domain & email identity
- Use AWS SDK (v3)
- Store keys in `.env`:
  ```
  AWS_ACCESS_KEY=
  AWS_SECRET_KEY=
  ```
- Setup `SesClient` & dynamic send email function

---

## ⏰ Cron Jobs

- Use `node-cron` 
- Daily scheduled emails to users with pending requests

---

## 💸 Razorpay Integration

- Razorpay Order creation from frontend
- Webhook setup to capture payment success
- Store transactions in DB
- Use keys from `.env`

---

## 💬 Real-Time Chat (Socket.IO)

- Route: `/chat/:targetUserId`
- Green indicator for online users
- "Last seen" status
- Auth checks for socket connections

---

## 📁 .env Example

```env
VITE_API_BASE_URL=http://devbond.com/api
```

Make sure to **not commit** your `.env` file.
---

## 🙌 Contributors

- [Pavan Singh](https://github.com/pavansingh888)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
