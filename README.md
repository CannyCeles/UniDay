# Smart Webcam-Based Student Attendance System 🎓📸

UniDay is a web-based student attendance system that utilizes biometric facial recognition via webcam. Built for the **AOL Software Engineering Project**, this application verifies students' faces against their pre-registered biometric profiles and records their class attendance automatically and securely.

---

### 💻 Powered by Modern Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="ShadcnUI" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
</p>

UniDay uses a React frontend paired with a NestJS backend. Facial recognition models are executed server-side via `face-api.js` over a MariaDB/MySQL database layer managed by Prisma.

---

## 📌 Overview

- **Name:** UniDay
- **Type:** Smart Webcam-Based Student Attendance System
- **Track:** Software Engineering AOL
- **Focus:** Secure biometric identification, webcam capture alignment, and real-time attendance management
- **Modules:**
  - Lecturer portal for class scheduling and live session control
  - Student portal for course enrollment and webcam verification
  - Biometric processing core powered by face-api.js

---

## 🔥 Features

- 🎭 **Roles**:
  - **Lecturers**: Create courses, create class sessions, open/close sessions, and view student attendance logs (with similarity scores & timestamps).
  - **Students**: Self-enroll in courses via the student dashboard, upload profile picture, capture webcam image, adjust/crop, verify face, and view past classes attendance history.
- 📸 **Webcam Capture & Crop**: Real-time webcam integration inside the student portal with interactive cropping.
- 🧬 **Face Verification**: Encodes facial landmarks into 128D mathematical descriptors, calculating similarity scores dynamically.
- 🕒 **Past Classes Logging**: Displays absolute status markers (`ATTENDED` in green, `ABSENT` in red) for student class records.

---

## 🎯 Problem Solved

Traditional roll-call attendance is slow, disrupts lectures, and is highly vulnerable to "proxy attendance" (titip absen). Automated solutions like paper signature sheets, barcodes, or QR codes are easily shared off-site. UniDay solves this by enforcing biometric validation. By verifying the student's face against a pre-registered profile descriptor right at the moment of check-in, UniDay ensures that only the physically present student can mark their attendance, improving academic integrity and efficiency.

---

## 💻 Mockups

### 🔐 Authentication Interface

- Login Page

<p align="center">
  <img width="1906" height="913" alt="image" src="https://github.com/user-attachments/assets/03ac6ea9-b059-4bbe-9d35-8b77d82613be" />
</p>

- Register Page

<p align="center">
 <img width="1907" height="916" alt="image" src="https://github.com/user-attachments/assets/9f7fa61b-c5d8-4b02-bfd9-87a66472883f" />
</p>

---

### 🎓 Student Interface

- Student Dashboard (Upcoming Classes)

<p align="center">
<img width="1901" height="905" alt="image" src="https://github.com/user-attachments/assets/6f682def-ca40-4e6f-8531-1599cbe99fd0" />
</p>

- View Past Classes

<p align="center">
  <img width="1896" height="906" alt="image" src="https://github.com/user-attachments/assets/b0cfd450-d290-4674-ad4b-f054703657f1" />

</p>

- Course Enrollment

<p align="center">
  <img width="1907" height="911" alt="image" src="https://github.com/user-attachments/assets/2ce77e82-5ec6-4c58-9df9-80c5a3d03877" />
</p>

- My Enrolled Courses

<p align="center">
 <img width="1907" height="912" alt="image" src="https://github.com/user-attachments/assets/964b00fc-d55f-404a-8e1f-f8f01e50f8d6" />
</p>

- Profile

<p align="center">
  <img width="1907" height="911" alt="image" src="https://github.com/user-attachments/assets/e3d65e90-becf-4d4f-9044-f2c8a81ca487" />
</p>

- Take Profile Photo

<p align="center">
  <img width="1897" height="903" alt="image" src="https://github.com/user-attachments/assets/de3bbdce-f252-4c5a-89ce-fafbab25298a" />

</p>

---

### 🧑‍🏫 Lecturer Interface

- Lecturer Dashboard (Upcoming Classes)

<p align="center">
  <img width="1907" height="912" alt="image" src="https://github.com/user-attachments/assets/b48f91fd-df02-4527-8226-9215977056bc" />

</p>

- Upcoming Class Details

<p align="center">
<img width="1901" height="911" alt="image" src="https://github.com/user-attachments/assets/ae9b3480-4056-4e86-8aa8-6d1d2f425296" />
</p>

- View Past Classes

<p align="center">
  <img width="1913" height="917" alt="image" src="https://github.com/user-attachments/assets/b75d3107-c2c8-4778-a6e5-6cbbf8413834" />

</p>

- Teaching Schedule

<p align="center">
 <img width="1911" height="912" alt="image" src="https://github.com/user-attachments/assets/f202a386-6cde-4b6e-b78c-d30ec4255b16" />

</p>

- Courses

<p align="center">
  <img width="1905" height="911" alt="image" src="https://github.com/user-attachments/assets/c975cd25-0c32-4aa3-890e-ee9e65010b0a" />

</p>

- Create Course

<p align="center">
  <img width="1906" height="911" alt="image" src="https://github.com/user-attachments/assets/6eeacaad-24dd-43a8-bb6b-9833f14fc527" />

</p>

- Assign Class Session

<p align="center">
  <img width="1912" height="912" alt="image" src="https://github.com/user-attachments/assets/6b70edbe-4c0a-4219-bc81-21a968c3bc0c" />

</p>

- Students

<p align="center">
  <img width="1907" height="906" alt="image" src="https://github.com/user-attachments/assets/4b8464c0-3c63-48b7-8a86-4c480d83b75e" />

</p>

- View Student Details

<p align="center">
  <img width="1911" height="910" alt="image" src="https://github.com/user-attachments/assets/34bc493c-9f4d-4a89-a732-fdd9858935c7" />

</p>

- Profile

<p align="center">
  <img width="1908" height="902" alt="image" src="https://github.com/user-attachments/assets/05d518ca-35e0-4cbd-887f-f81b399e4bcf" />
</p>

---

## 📋 Prerequisites

Before setting up the project, install these packages on your local machine:

- **Node.js** (v18.x or later) -> [Node.js Guide](https://academic600.notion.site/NodeJS-42524704efd54e4897b11194a8dfb5aa)
- **MariaDB / MySQL** (via XAMPP) -> [XAMPP Guide](https://academic600.notion.site/XAMPP-bb7b3652b24241bf9c29c31dddd0684c)
- **Git**

Verify Node.js and NPM installations:
```bash
node -v
npm -v
```

---

## 🚀 How to Run Locally

### 1. Clone the project
```bash
git clone https://github.com/CannyCeles/UniDay.git
cd UniDay
```

### 2. Setup Backend
1. **Navigate to the backend folder & Install dependencies:**
   ```bash
   cd backend
   npm install
   npm install @prisma/adapter-mariadb
   ```
2. **Setup environment variables:**
   Create a `backend/.env` file and paste the following parameters:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=
   DB_NAME=uniday_db

   JWT_SECRET=secret
   ```
   > ⚠️ **IMPORTANT:** Do NOT use `DATABASE_URL` in `.env`. This project uses a custom Prisma adapter.

3. **Setup Database:**
   - Open XAMPP Control Panel and start **MySQL**.
   - Navigate to http://localhost/phpmyadmin and click **New** to create a database named `uniday_db`.

4. **Initialize Prisma schema:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start backend server:**
   ```bash
   npm run start:dev
   ```
   The backend server runs at `http://localhost:3000`.

### 3. Setup Frontend
1. **Navigate to the frontend folder & Install dependencies:**
   In a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
2. **Setup environment variables:**
   Create a `frontend/.env` file and paste:
   ```env
   VITE_API_URL="http://localhost:3000"
   ```
3. **Start frontend server:**
   ```bash
   npm run dev
   ```
   The frontend application runs at `http://localhost:5173`.
