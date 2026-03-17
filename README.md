# 智启岐黄 - TCM Learning Platform

A comprehensive Traditional Chinese Medicine (TCM) learning platform with interactive lessons, AI voice assessment, gamified exercises, and progress tracking.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| **Interactive Lessons** | 6-part lesson on Yin-Yang philosophy, body systems, and symptoms |
| **60+ Exercises** | Vocabulary, Yin-Yang properties, and clinical applications |
| **AI Voice Assessment** | Practice pronunciation of 12 key TCM phrases |
| **2 Games** | Classification Game and Balance Puzzle |
| **Progress Tracking** | Automatic recording of completed exercises and wrong answers |
| **Wrong Answer Book** | Review and practice mistakes |
| **Bilingual Interface** | Switch between Chinese and English |
| **User Authentication** | Secure login and registration |

### Games
1. **阴阳分类诊断室** - Drag and drop items to Yin/Yang zones
2. **阴阳平衡拼图** - Balance a scale using Yin/Yang weights

### Exercise Categories
| Category | Questions | Topics |
|----------|-----------|--------|
| Vocabulary | 20 | TCM terminology |
| Yin-Yang Properties | 20 | Natural phenomena, body parts |
| Clinical Application | 20 | Diagnosis, treatment |

## 🛠 Technology Stack

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Password Encryption**: bcryptjs

## 📦 Prerequisites

### Required Software
| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18.x or higher | [Download](https://nodejs.org/) |
| **npm** | 9.x or higher | Comes with Node.js |
| **XAMPP** | 8.x | [Download](https://www.apachefriends.org/) |
| **Git** | Latest | [Download](https://git-scm.com/) |

### System Requirements
- **RAM**: Minimum 4GB
- **Storage**: 500MB free space
- **OS**: Windows 10/11, macOS, Linux
- **Browser**: Chrome, Firefox, Edge, Safari (latest)

## 🚀 Installation Guide

### Step 1: Install Node.js
1. Go to [Node.js website](https://nodejs.org/)
2. Download LTS version (18.x or higher)
3. Run installer (click "Next" through all steps)
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```
### Step 2: Install XAMPP
1. Go to Apache Friends[Apache Friends](https://www.apachefriends.org/)
2. Download XAMPP for your OS
3. Run installer with default settings
4. Open XAMPP Control Panel

### Step 3: Download Project
  ```bash
# Clone repository
git clone https://github.com/mejbauddin/tcmdemo-master.git

# Navigate to project
cd tcmdemo-master
```

### Step 4: Set Up Database
4.1 Start MySQL
1. Open XAMPP Control Panel
2. Click Start for MySQL

4.2 Create Database
1. Open browser: http://localhost/phpmyadmin
2. Click New
3. Database name: tcm_learning
4. Click Create

4.3 Create Tables
1. Select tcm_learning database
2. Click SQL tab
3. Copy and paste this SQL:
  ```bash
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    options JSON,
    exercise_type ENUM('classification', 'balance', 'voice') DEFAULT 'classification',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User answers table
CREATE TABLE user_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    user_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Wrong answers table
CREATE TABLE wrong_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    wrong_answer VARCHAR(255) NOT NULL,
    attempt_count INT DEFAULT 1,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_exercise (user_id, exercise_id)
);

-- Voice assessments table
CREATE TABLE voice_assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    audio_url VARCHAR(500),
    transcript TEXT,
    accuracy_score DECIMAL(5,2),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample exercises
INSERT INTO exercises (lesson_id, question_text, correct_answer, options, exercise_type) VALUES
(1, '发热 (Fever) belongs to?', 'yang', '["yang","yin"]', 'classification'),
(1, '畏寒 (Chills) belongs to?', 'yin', '["yang","yin"]', 'classification'),
(1, '头 (Head) belongs to?', 'yang', '["yang","yin"]', 'classification'),
(1, '脚 (Feet) belongs to?', 'yin', '["yang","yin"]', 'classification'),
(1, '背部 (Back) belongs to?', 'yang', '["yang","yin"]', 'classification'),
(1, '腹部 (Belly) belongs to?', 'yin', '["yang","yin"]', 'classification'),
(1, 'Say "头在上，属阳"', '头在上，属阳', NULL, 'voice'),
(1, 'Say "气为阳，血为阴"', '气为阳，血为阴', NULL, 'voice');
```

4. Click Go to execute
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create uploads folder
mkdir uploads
```
Create .env file in backend folder:
```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tcm_learning
JWT_SECRET=tcm_learning_secret_key_2026
```
### Step 6: Configure Frontend
```bash 
# Go back to project root
cd ..

# Install dependencies
npm install
```
### Step 7: Run the Application
Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Expected output:
Server running on port 5000
Database connected successfully!

## Terminal 2 - Frontend:
```bash
cd tcmdemo-master
npm run dev
```
Expected output:
VITE v4.x ready
Local: http://localhost:5173/

### Step 8: Open Application
1. Open browser
2. Go to: http://localhost:5173
3. Click "Register" to create account
4. Start learning!

## 📁 Project Structure
```bash
tcmdemo-master/
├── backend/                          # Backend server
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── exerciseController.js
│   │   └── voiceController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Exercise.js
│   │   └── WrongAnswer.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── exerciseRoutes.js
│   │   └── voiceRoutes.js
│   ├── uploads/
│   ├── .env
│   └── server.js
│
├── src/                               # Frontend source
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginModal.vue
│   │   │   ├── RegisterModal.vue
│   │   │   └── UserProfile.vue
│   │   ├── exercises/
│   │   │   └── ExerciseBank.vue
│   │   ├── voice/
│   │   │   └── VoiceAssessment.vue
│   │   ├── LessonOne.vue
│   │   ├── LessonOneIntro.vue
│   │   ├── LessonOnePhilosophy.vue
│   │   ├── LessonOneBody.vue
│   │   ├── LessonOneBalance.vue
│   │   ├── LessonOneGame.vue
│   │   ├── LessonOneSummary.vue
│   │   ├── MarketingHome.vue
│   │   └── TCMHome.vue
│   ├── data/
│   │   └── exercises.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── exerciseService.js
│   │   └── voiceService.js
│   ├── stores/
│   │   ├── authStore.js
│   │   └── exerciseStore.js
│   ├── App.vue
│   └── main.js
│
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 📖 Usage Guide
#### 1. Registration
 - Click "Start Learning" or "Login"
 - Click "Register" link
 - Fill: Username, Email, Password
 - Click "Register"

#### 2. Navigation
 - Sidebar (☰): Lesson directory
 - Top Navigation: Textbook, Features, Tools
 - User Menu: Click username for profile

#### 3. Taking a Lesson
1. Select "第一课: 日月与阴阳" from sidebar
2. Navigate using "Back"/"Next" buttons
3. Complete all 6 parts:
    - Part 1: Introduction
    - Part 2: Philosophy
    - Part 3: Body & Symptoms
    - Part 4: Balance & Mutual Root
    - Part 5: Language Practice
    - Part 6: Summary & Exercises
   
#### 4. Doing Exercises
1. Go to Part 6 (Summary)
2. Click "第一课 60题" card
3. Choose category:
    - 全部 (All): 60 questions
    - 词汇 (Vocabulary): 20 questions
    - 阴阳属性 (Yin-Yang): 20 questions
    - 应用 (Application): 20 questions

4. Select answer (A, B, C, D)
5. Click "提交答案" to check
6. Click "查看解析" for explanation
7. Click "下一题" to continue

#### 5. Voice Assessment
1. In Part 6, scroll to "AI 语音评测练习"
2. Click any phrase
3. Allow microphone access
4. Click red button to record
5. Click square to stop
6. Click "提交评测" for feedback
7. View score (0-100%)

#### 6. Games
1. In Part 6, click "阴阳调和师"
2. Choose game:
    - Game 1: Drag cards to Yin/Yang zones
    - Game 2: Drag weights to balance scale
  
#### 7. Tracking Progress
1. Click username (top-right)
2. View profile:
    - Username, Email
    - Member since
    - Wrong answers list
3. Click "Wrong Answers" to review mistakes

#### 📡 API Documentation
Base URL: http://localhost:5000/api
Register
```bash
# http
POST /auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
Login
```bash
# http
POST /auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
Get Exercises
```bash
# http
GET /exercises
Authorization: Bearer <token>
```
Submit Answer
```bash
# http
POST /exercises/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "exerciseId": 1,
  "answer": "B"
}
```
Get Wrong Answers
```bash
# http
GET /exercises/wrong-answers
Authorization: Bearer <token>
```
#### 🔧 Troubleshooting
Issue 1: Backend Won't Start - Port 5000 in Use
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000

# Kill process (replace 12345 with PID)
taskkill /PID 12345 /F

# Or change port in backend/.env
PORT=5001
# Update frontend API_URL to http://localhost:5001/api
```
#### Issue 2: Database Connection Failed
Check:
    - XAMPP MySQL is running (green)
    - Database tcm_learning exists
    - .env credentials are correct
    
#### Issue 3: Frontend Can't Connect to Backend
Check:
    - Backend is running (node backend/server.js)
    - API URL in src/services/api.js is correct
    - CORS is enabled in backend

#### Issue 4: Voice Recording Not Working
   - Allow microphone access in browser
   - Use Chrome or Edge
   - Check microphone in other apps
   - Try on HTTPS in production

#### Issue 5: Exercises Not Showing
   - Are you logged in?
   - Check browser console (F12)
   - Verify database has exercises:
```bash
# SQL
SELECT COUNT(*) FROM exercises;
```
#### Issue 6: Login Fails
   - Is backend running?
   - Check database connection
   - Clear localStorage:
```bash
localStorage.clear()
```
### Quick Diagnostic Commands
```bash
# Check backend
curl http://localhost:5000

# Test registration
cd backend
node test-register.mjs

# Check Node version
node --version
npm --version
```
### Ports Used
```bash 
Service	   Port	   Purpose
Frontend	5173	   Vue app
Backend	     5000	   API server
MySQL	    3306	   Database
phpMyAdmin	80	      DB management
```
### ❓ FAQ
Q: Do I need internet connection?
A: Yes, for first-time setup to install packages. After that, runs locally.

Q: Can I use this on mobile?
A: Yes, the interface is responsive and works on mobile browsers.

Q: How do I reset my password?
A: Contact admin or use phpMyAdmin to update directly.

Q: Where are voice recordings stored?
A: In backend/uploads/ folder.

Q: How do I backup my data?
A: Export database from phpMyAdmin:
```bash
# SQL
mysqldump -u root -p tcm_learning > backup.sql
```
Q: Can I add more exercises?
A: Yes, edit src/data/exercises.js

Q: How do I change language?
A: Click language toggle button in navbar.

Q: Why is voice assessment giving low scores?
A: It's simulated for demo. In production, integrate with Google/Azure Speech API.

### 🎉 Success!
You have successfully installed 智启岐黄 TCM Learning Platform!
Next Steps:

1. Create account
2. Complete Lesson 1
3. Try exercises
4. Practice voice phrases
5. Play games
6. Review wrong answers

Happy Learning! 🌟
