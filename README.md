# 💰 Financial Management System (Full-Stack)

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📌 About the Project
A full-stack web application developed for personal finance tracking. The system allows users to log incomes and expenses, automatically calculates the current balance, and displays an interactive dashboard with a monthly summary of expenses.

The user interface was designed with a dark theme and Glassmorphism elements (translucent glass effect), providing a modern and responsive experience.

## 🚀 Features
- **Transaction Logging:** Add incomes and expenses with description, amount, date, and category.
- **Dynamic Balance Calculation:** Real-time total balance updates based on the inserted transactions.
- **Visual Dashboard:** Interactive Doughnut chart categorizing the current month's expenses.
- **Data Management:** Delete records with immediate updates to both the UI and the database.
- **Data Persistence:** Complete integration with a relational database for secure history storage.

## 🛠️ Technologies Used

### Back-end

- **Spring Boot** (Web, Data JPA)
- **MySQL** (Production/development database)
- **H2 Database** (Initially used for in-memory testing)
- **Maven** (Dependency management)

### Front-end
- **HTML5 & CSS3** (Responsive design and Glassmorphism)
- **JavaScript (Vanilla)** (REST API consumption via `fetch`)
- **Chart.js** (Dynamic chart rendering)

## ⚙️ How to Run the Project Locally

### Prerequisites
- Java JDK (25)
- MySQL Server running locally
- *Live Server* extension (or similar) in your code editor.

### Database Configuration (MySQL)
Run the following script in your MySQL client to create the database and table:
```sql
CREATE DATABASE controle_financeiro;
USE controle_financeiro;

CREATE TABLE transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15, 2) NOT NULL,
    data DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);
```

## ScreenShots

<img width="1919" height="995" alt="Captura de tela 2026-03-12 234642" src="https://github.com/user-attachments/assets/3a0ab304-0935-422b-9dad-7dd1bffed34c" />


