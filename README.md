## Cryptocurrency Price Monitoring System

### Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Redis (caching), JWT
- **Frontend**: React, Vite
- **Others**: EmailJS (password recovery), Vercel (client deployment)

---

### Key Features

#### Backend:

1. **Real-time Monitoring**:
   - Fetches and updates cryptocurrency prices continuously.
2. **Alerting System**:
   - Allows users to set min/max price triggers for coins.
   - Sends real-time alerts when criteria are met.
3. **Caching Mechanism**:
   - Implements Redis caching for efficient price updates.
   - Refreshes cached data periodically for accuracy.
4. **Authentication**:
   - Secure user registration and login with JWT-based authorization.
   - Rate-limiting to prevent abuse.
5. **Account Recovery**:
   - Password reset and recovery via email.
6. **Routes**:
   - `/auth`, `/home`, `/forgotPassword`, `/trigger`, `/crypto`.

#### Frontend:

1. User-friendly UI to interact with all backend features.
2. Routes include:
   - **Authentication**: `/login`, `/register`, `/forgotPassword`, `/resetPassword`.
   - **Features**: `/home`, `/topCoins`, `/searchCoins`, `/coin/:id`.
3. Dynamically updates real-time coin prices and user alerts.

---

### Setup and Local Testing

#### Steps to Run:

1. Clone the repo:
   ```bash
   git clone <repo-url>
   ```
2. Install dependencies:
   ```bash
   npm i # in both `client` and `server`
   ```
3. Run the project:
   - Backend:
     ```bash
     cd server
     npm run start-all
     ```
   - Frontend:
     ```bash
     cd client
     npm run dev
     ```

---

### File Structure Overview

- **Client**: Contains React components, utilities, and stylesheets.
- **Server**: Organized into `api`, `controllers`, `models`, `workers`, and `middleware` for maintainable code.

---

### Website Features

#### Backend:

- Real-time cryptocurrency tracking.
- User-defined alerts for coin prices.
- Caching for faster data updates.
- Secure authentication and rate-limiting.
- Password recovery via email.

#### Frontend:

- Intuitive UI with routes for tracking coins, setting alerts, and account management.
- Real-time updates on coin prices.
- Dynamic alert creation for price triggers.
