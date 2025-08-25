// Simple Stripe test server
require('dotenv').config();

// Debug environment variables
console.log('=== STRIPE TEST SERVER ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 3000);
console.log('STRIPE_SECRET_KEY present:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length || 0);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is missing!');
  process.exit(1);
}

console.log('✅ STRIPE_SECRET_KEY found, starting server...');

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (index.html)

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Stripe test server running',
        timestamp: new Date().toISOString()
    });
});

// Create Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { mode, line_items, success_url, cancel_url, metadata } = req.body;

        console.log('Creating checkout session:', {
            mode,
            items: line_items.length,
            metadata
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: mode,
            success_url: success_url,
            cancel_url: cancel_url,
            metadata: metadata || {},
        });

        console.log('✅ Checkout session created:', session.id);
        
        res.json({ 
            id: session.id,
            url: session.url 
        });

    } catch (error) {
        console.error('❌ Error creating checkout session:', error.message);
        res.status(500).json({ 
            error: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Stripe test server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} to test`);
    console.log('==========================');
});

module.exports = app;