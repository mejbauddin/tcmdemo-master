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
