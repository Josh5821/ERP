# Enterprise Resource Planning (ERP) System

A modern, full-stack Enterprise Resource Planning application designed for managing core business processes including sales, purchases, inventory, suppliers, customers, and role-based staff access.

---

## Architecture & Project Structure

The project follows a decoupled client-server architecture organized cleanly into `backend` and `frontend`:

```text
├── backend/                       # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/demoERP/
│   │   │   │   ├── config/        # Security & JWT configuration
│   │   │   │   ├── controller/    # REST API endpoints
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── pojo/          # JPA Entities / Models
│   │   │   │   ├── repository/    # Spring Data JPA Repositories
│   │   │   │   └── service/       # Business logic implementations
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                  # Unit and integration tests
│   ├── .mvn/                      # Maven wrapper files
│   ├── mvnw / mvnw.cmd            # Maven wrapper scripts
│   └── pom.xml                    # Maven dependencies & configuration
│
├── frontend/                      # React + Vite Client
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── components/            # UI modules (Sales, Purchase, Customer, etc.)
│   │   │   ├── customer/          # Customer views & modals
│   │   │   ├── product/           # Product management
│   │   │   ├── purchase/          # Purchase orders, invoices, payments
│   │   │   └── sales/             # Sales orders, invoices, payments
│   │   ├── App.jsx                # App root & route definitions
│   │   ├── axiosConfig.js         # Centralized Axios client & JWT interceptors
│   │   ├── Login.jsx              # User authentication screen
│   │   ├── Register.jsx           # User registration screen
│   │   └── main.jsx               # React entrypoint
│   ├── index.html                 # Single page application template
│   ├── package.json               # Dependencies & npm scripts
│   └── vite.config.js             # Vite build configuration
│
├── .gitignore                     # Repository-level ignore rules
└── README.md                      # Project documentation
```

---

## Tech Stack

### Backend
- **Framework:** Spring Boot 3.3.0
- **Language:** Java 17
- **Security:** Spring Security with stateless JWT (JSON Web Token) authentication
- **Database Access:** Spring Data JPA / Hibernate
- **Database:** MySQL
- **Build & Dependency Management:** Apache Maven

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM (v7)
- **API Client:** Axios (with request token interceptor)
- **UI & Icons:** Bootstrap 5, Bootstrap Icons, React Icons

---

## Getting Started

### 1. Database Setup
Ensure MySQL is running on your system, then create the database:
```sql
CREATE DATABASE erpdb;
```
Configure your database username and password in `backend/src/main/resources/application.properties` if they differ from the default:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/erpdb
spring.datasource.username=root
spring.datasource.password=1234
```

---

### 2. Running the Backend
Navigate to the `backend` folder:
```bash
cd backend
```
Run using the Maven wrapper:
- **Windows:**
  ```cmd
  mvnw.cmd spring-boot:run
  ```
- **macOS / Linux:**
  ```bash
  ./mvnw spring-boot:run
  ```
The REST API will start on **`http://localhost:8080`**.

---

### 3. Running the Frontend
In a new terminal window, navigate to the `frontend` folder:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
The client application will be accessible at **`http://localhost:5173`**.

---

## Core Features & Modules

- **Authentication & Security:** Secure JWT-based login, signup, and protected route access.
- **Dashboard:** Real-time business KPIs and financial summaries.
- **Product & Inventory Management:** Track stock levels, pricing, categories, and item codes.
- **Customer Management:** Manage client records, contact details, and transaction history.
- **Supplier Management:** Vendor profiles and contact directories.
- **Purchase Workflow:** Purchase order creation, itemized supplier invoices, and vendor payments.
- **Sales Workflow:** Customer order creation, itemized invoices, receipts, and payment settlements.
- **Role-Based Permissions:** Manage roles and system access controls for employees.

---

## License
Private and confidential project.

