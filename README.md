## Cryptocurrency Price Monitoring System

(Project services closed)

### Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Redis (caching), JWT
- **Frontend**: React, Vite

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
   git clone https://github.com/Hassaaan1010/RegisterAPI.git
   ```

2. Run the project:
   - Backend:
     ```bash
     cd server
     npm i
     npm run start-all
     ```
   - Frontend:
     ```bash
     cd client
     npm i
     npm run dev
     ```

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

## Challenges Faced

#### Setting Up a Live Record of Changing Prices

- Challenge: Maintaining a live feed of cryptocurrency prices for all coins of interest.
- Solution: Implemented a parallel worker that fetches prices every 60 seconds and stores them in cache, ensuring up-to-date information for users.

#### Managing Cache for Different Purposes

- Challenge: Efficiently handling cache storage for both topCoins and individual coins of interest without conflicts.
- Solution: Standardized a storage convention, storing topCoins as a single cache entry and each coin of interest as independent key-value pairs.

#### Setting Up Triggers for Mail Services

- Challenge: Automating email notifications for triggers while managing their states.
- Solution: Created trigger documents and implemented a parallel worker that runs every 40 seconds, checking for triggers:
  - Activates triggers that meet conditions and sends emails using SMTP NodeMailer.
  - Updates triggers that are active but should be set to inactive.

#### Maintaining Modularity and Best Practices

- Challenge: Balancing productivity with code modularity and maintainability.
- Solution: Adopted a top-down approach by defining controllers at a high level and abstracting reusable logic into helper functions, ensuring clean and maintainable code.

---

### Project Flow Explanation

1. **Overview:**
   - The project is a full-stack application with clearly defined routes and middleware for user authentication, cryptocurrency management, and password recovery.
   - Backend API routes are connected to specific controllers and helpers, ensuring modular and maintainable code.
   - The frontend interacts with these API routes via React components, providing a seamless user experience.

---

2. **Backend Structure:**
   - **API Routes:**
     - Located in `api/`, each file corresponds to a specific feature or module. Examples:
       - `authRoutes.js`: Handles login and registration (`/auth/login`, `/auth/register`).
       - `cryptoRoutes.js`: Manages cryptocurrency-related actions (`/crypto/topCoins`, `/crypto/addCoin`).
       - `forgotPasswordRoutes.js`: Supports account recovery and password reset.
     - All routes are registered centrally via `_index.js` for scalability.
   - **Controllers & Helpers:**
     - Business logic is handled in `controllers/`, with reusable logic abstracted into `helpers/`.
       - Example: `cryptoControllers.js` calls helper methods in `cryptoHelpers.js`.
   - **Middleware:**
     - Security and rate-limiting are enforced via `middleware/`.
       - `jwtAuthorizer.js`: Verifies user tokens.
       - `rateLimiter.js`: Limits request rates to prevent abuse.
   - **Models:**
     - MongoDB schemas in `models/` define the structure for tokens, triggers, and users.
   - **Workers:**
     - Background tasks like price fetching (`priceFetcher.js`) and notifications (`triggerNotifier.js`) run asynchronously.

---

3. **Frontend Flow:**
   - React client defines user-facing routes mapped to backend endpoints:
     - `/home`: Renders the homepage (`Home.jsx`).
     - `/login` & `/register`: Handles user authentication.
     - `/forgotPassword` & `/forgotPassword/resetPassword/:userId`: Supports account recovery and password reset.
     - `/coin/:id`: Displays details for a specific cryptocurrency.
     - `/topCoins`: Lists trending cryptocurrencies.
     - `/searchCoins`: Renders a search page for cryptocurrencies.
     - Wildcard route (`*`): Redirects unauthenticated users to `/login`.

---

4. **Route Middleware Mapping (Backend):**
   - Each backend route uses middleware to enforce security and functionality:
     - **Example: `/home`**
       - Methods: `GET`
       - Middleware: `rateLimit`, `authorizeToken`, `anonymous`.
     - **Example: `/crypto/addCoin`**
       - Methods: `POST`
       - Middleware: `anonymous`, `authorizeToken`, `addCoin`.

---

5. **File and Directory Flow:**
   - Backend routes and frontend components align logically:
     - **Backend**: `authRoutes.js` manages `/auth/*`, while corresponding components (`Login.jsx`, `Register.jsx`) handle the client-side flow.
     - **Shared Logic**: Middleware like `jwtAuthorizer.js` and helper utilities like `errorHandling.js` ensure a robust flow between API requests and responses.
