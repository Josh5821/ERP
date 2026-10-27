# ERP Backend

Spring Boot REST API backend service for the ERP application with JWT authentication and MySQL persistence.

## Tech Stack
- **Framework:** Spring Boot 3.3.0
- **Language:** Java 17
- **Security:** Spring Security & JWT (JSON Web Tokens)
- **Data Access:** Spring Data JPA / Hibernate
- **Database:** MySQL
- **Build Tool:** Maven

## Key Modules
- **Authentication & Authorization:** User registration, JWT login, role-based access control.
- **Customer Management:** Customer directory, contact info, balance/credit tracking.
- **Supplier Management:** Vendor profiles and contact directories.
- **Product Management:** Inventory items, categories, pricing, stock levels.
- **Purchase Management:** Purchase orders, supplier invoices, purchase payments.
- **Sales Management:** Sales orders, customer invoices, sales payments.
- **Dashboard & Analytics:** Summary metrics across sales, purchases, and finances.

## Getting Started

### Prerequisites
- JDK 17 or higher
- MySQL 8.x
- Maven 3.8+ (or use the included `mvnw`)

### Database Setup
1. Create a database in MySQL:
   ```sql
   CREATE DATABASE erpdb;
   ```
2. Check/update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/erpdb
   spring.datasource.username=root
   spring.datasource.password=1234
   ```

### Running Locally
Run with Maven Wrapper:

- **Windows:**
  ```cmd
  mvnw.cmd spring-boot:run
  ```
- **Linux/macOS:**
  ```bash
  ./mvnw spring-boot:run
  ```

The REST API server will run on `http://localhost:8080`.

