# Telegram-Based P2P Betting App (ZenSports-Style) - MVP Architecture

## 1. High-Level Architecture

### Components
1. **Telegram Mini App + Bot**
   - Handles user interactions inside Telegram
   - Provides login, bet creation, joining, wallet info
2. **Backend (API)**
   - Handles business logic: bets, matching engine, wallet, payouts
   - REST or GraphQL API
3. **Database**
   - Stores users, bets, wallets, transactions
4. **Payment Gateway**
   - Stripe / PayPal for fiat
   - Crypto (e.g., USDT, BTC via wallet integration)
5. **Admin Panel**
   - Manage results, disputes, commissions

### Tech Stack
- **Frontend:** Telegram WebApp (HTML, JS) + Bot API
- **Backend:** Node.js / NestJS (or Express), WebSocket for real-time bet updates
- **Database:** PostgreSQL (Relational), Redis (Real-time bet matching)
- **Authentication:** Telegram Login Widget, JWT for API
- **Payments:** Stripe, Crypto (USDT/BTC) via Coinbase Commerce
- **Hosting:** AWS / Render, PostgreSQL on RDS, Telegram Bot on Node.js

---

## 2. Core Features & Flow

### User Flow
1. **Login** (Telegram auth)
2. **Deposit Funds** (Stripe/Crypto → update wallet)
3. **Create Bet**
   - Event name: `Man City vs Chelsea`
   - Bet Type: Win/Lose
   - Amount: `$20`
   - Expiry: `5 mins before match start`
4. **Join Bet**
   - See list of open bets
   - Join opposite side
   - Funds locked in escrow
5. **Auto Matching**
   - Redis queues unmatched bets
   - Real-time updates via WebSocket
6. **Result Processing**
   - Admin sets result OR auto from sports API
7. **Payout**
   - Winner gets pool minus **5% commission**
8. **Withdraw**
   - User requests withdrawal → payout via Stripe/crypto
9. **Admin Dashboard**
   - View commission stats, disputes, users

---

## 3. Database Design

### Tables

#### `users`
| Column       | Type     |
|--------------|----------|
| id           | UUID     |
| telegram_id  | String   |
| username     | String   |
| phone        | String   |
| email        | String   |
| created_at   | DateTime |

#### `wallets`
| Column     | Type     |
|------------|----------|
| id         | UUID     |
| user_id    | UUID     |
| balance    | Decimal  |
| currency   | String   |
| updated_at | DateTime |

#### `transactions`
| Column     | Type                          |
|------------|-------------------------------|
| id         | UUID                          |
| user_id    | UUID                          |
| type       | Enum (deposit/withdraw/bet)   |
| amount     | Decimal                       |
| status     | Enum (pending/complete/failed)|
| created_at | DateTime                      |

#### `bets`
| Column      | Type                            |
|-------------|---------------------------------|
| id          | UUID                            |
| creator_id  | UUID                            |
| event_name  | String                          |
| side        | Enum (home/away)                |
| amount      | Decimal                         |
| status      | Enum (open/matched/settled)     |
| expiry_time | DateTime                        |

#### `bet_matches`
| Column  | Type                       |
|---------|----------------------------|
| id      | UUID                       |
| bet_id  | UUID                       |
| user_id | UUID                       |
| side    | Enum (home/away)           |
| amount  | Decimal                    |
| status  | Enum (pending/settled/lost)|

#### `commissions`
| Column     | Type     |
|------------|----------|
| id         | UUID     |
| bet_id     | UUID     |
| amount     | Decimal  |
| created_at | DateTime |

---

## 4. Real-Time Matching Logic
- Use **Redis Sorted Sets** to keep unmatched bets grouped by:
  - Event name
  - Bet side
  - Amount
- When a new bet comes:
  - Check if an opposite side exists
  - If yes → Match → Lock funds → Notify both users via Telegram Bot
  - If no → Add to Redis pending queue

---

## 5. Telegram Integration
- **Telegram Bot API**
  - `/start` → Login via Telegram
  - Inline buttons: `Create Bet`, `Join Bet`, `Wallet`, `History`
- **WebApp for UI**
  - For rich UI inside Telegram (React or plain JS)
- **Authentication**
  - Use Telegram’s **login widget** → verify hash → issue JWT for API

---

## 6. Payment Handling
- **Deposit**
  - Stripe → webhook → credit wallet
  - Crypto → Coinbase Commerce → webhook → credit wallet
- **Withdraw**
  - Manual approval OR automated via Stripe Connect or crypto wallet API

---

## 7. Commission System
- Commission = **5% of total pool**
- Store in `commissions` table
- Show in **Admin Dashboard**

---

## 8. Non-Functional Requirements (MVP)
- **Security:** 2FA optional, escrowed funds, idempotent webhooks
- **Performance:** Redis-backed queues, pagination on bet lists
- **Compliance:** Geo-blocking where required, KYC for large withdrawals
- **Observability:** Structured logs, alerts for webhook failures

---

## 9. Next Steps
- Define API contracts (NestJS DTOs + Swagger)
- Set up Telegram Bot + WebApp skeleton
- Implement wallet deposit/withdraw with webhooks
- Build matching engine with Redis
- Add result processing (manual + sports API integration)
- Ship admin dashboard (metrics + disputes + commissions)
