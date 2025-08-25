# Stripe Test Project

Minimal test to verify Stripe payments work correctly.

## Local Development

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Set your Stripe secret key in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start server:
   ```bash
   npm start
   ```

5. Open http://localhost:3000

## Deployment

Set `STRIPE_SECRET_KEY` environment variable in your hosting platform.