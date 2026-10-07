# Smart Job Tracker 🚀

A full-stack job application and career tracking platform that helps job seekers manage job opportunities, track application progress, and analyze their job search activity from one centralized dashboard.

Built with **React.js, FastAPI, PostgreSQL, SQLAlchemy, and REST APIs**.

---

## 📌 Overview

Managing multiple job applications using spreadsheets or notes can become difficult as the number of applications increases.

**Smart Job Tracker** provides a centralized platform where users can:

- Manage job opportunities
- Track application status
- Search, filter, sort, and paginate job records
- Track interview and application progress
- View application statistics
- Analyze job-search performance
- Securely access their personal data

The application follows a **full-stack architecture**, with React handling the frontend and FastAPI providing the backend REST APIs.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Current-user authentication
- Duplicate email validation
- Secure password hashing
- Automatic handling of unauthorized API requests

### 💼 Job Management

Users can:

- Add new job opportunities
- Update job details
- Delete jobs
- View job listings
- Search jobs
- Filter jobs by employment type
- Filter by location
- Sort job records
- Paginate large datasets

Job information includes:

- Company name
- Job title
- Location
- Job URL
- Job description
- Salary range
- Employment type

### 📋 Application Tracking

Track the progress of applications through different stages:

```text
Saved
  ↓
Applied
  ↓
Shortlisted
  ↓
Assessment
  ↓
Interview
  ↓
Offer
  ↓
Selected
