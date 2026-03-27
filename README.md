# 🚀 SkillMap

SkillMap is an AI-powered full-stack web application that generates **personalized skill recommendations, project ideas, and learning roadmaps** based on user interests, goals, and experience.

---

## ✨ Features

* 🧠 AI-powered recommendations using Google Gemini
* 🎯 Personalized skill suggestions
* 💡 Project ideas tailored to user profile
* 🗺️ Step-by-step learning roadmap
* 🌙 Modern dark UI with smooth animations
* 📱 Fully responsive design

---

## 🛠️ Tech Stack

* Frontend: React + Tailwind CSS
* Backend: Node.js + Express
* AI: Google Gemini API (gemini-1.5-flash)

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/skillmap.git
cd skillmap
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Add environment variable

Create a `.env` file inside `/server`:

```
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the app

```bash
# Run backend
cd server
node index.js

# Run frontend
cd client
npm start
```

---

## 🤖 How It Works

1. User fills onboarding form
2. Data is sent to backend
3. Gemini AI processes profile
4. Returns personalized JSON
5. UI displays skills, projects & roadmap

---

## 📌 Future Improvements

* Add user authentication
* Save user history
* Export roadmap as PDF
* Add real-time progress tracking

---

## 🧑‍💻 Author

Built by YOU 🚀
