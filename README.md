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
git clone https://github.com/yourusername/tcmdemo-master.git

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
