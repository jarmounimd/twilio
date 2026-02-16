require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// In-memory storage for POC (replace with MongoDB in production)
const clients = new Map();

// ============================================
// 1. WEBHOOK VERIFICATION (GET /webhook)
// ============================================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('📞 Webhook verification request received');
  console.log('Mode:', mode);
  console.log('Token:', token);

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification failed!');
    res.sendStatus(403);
  }
});

// ============================================
// 2. RECEIVE MESSAGES (POST /webhook)
// ============================================
app.post('/webhook', (req, res) => {
  console.log('\n📨 Incoming webhook event:');
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Extract phone number ID (identifies which client)
    const phoneNumberId = value?.metadata?.phone_number_id;
    
    // Extract message details
    const messages = value?.messages;
    if (messages && messages.length > 0) {
      const message = messages[0];
      const from = message.from; // Sender's WhatsApp number
      const messageBody = message.text?.body;
      const messageId = message.id;

      console.log(`\n💬 Message received:`);
      console.log(`  From: ${from}`);
      console.log(`  Phone Number ID: ${phoneNumberId}`);
      console.log(`  Message: ${messageBody}`);
      console.log(`  Message ID: ${messageId}`);

      // Here you would:
      // 1. Identify which client owns this phone_number_id
      // 2. Store message in MongoDB
      // 3. Emit to Socket.io for real-time updates
      // 4. Trigger any automation/workflows
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

// ============================================
// 3. EMBEDDED SIGNUP CALLBACK (GET /embedded-signup)
// ============================================
app.get('/embedded-signup', async (req, res) => {
  console.log('\n🔐 Embedded Signup callback received');
  console.log('Query params:', req.query);
  console.log('Body:', req.body);

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Exchange code for access token
    console.log('🔄 Exchanging code for access token...');
    
    const tokenResponse = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: 'https://multifactorial-patria-peakily.ngrok-free.dev/embedded-signup',
        code: code
      }
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Access token received!');

    // Get phone number details
    console.log('📞 Fetching phone number details...');
    
    const debugResponse = await axios.get(`https://graph.facebook.com/v21.0/debug_token`, {
      params: {
        input_token: accessToken,
        access_token: `${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`
      }
    });

    console.log('Debug token response:', debugResponse.data);

    // Store client data
    const clientId = `client_${Date.now()}`;
    const clientData = {
      id: clientId,
      accessToken: accessToken,
      connectedAt: new Date().toISOString(),
      // You'll get phone_number_id from the first message or from additional API calls
    };

    clients.set(clientId, clientData);
    console.log(`✅ Client ${clientId} connected successfully!`);
    console.log('Total clients:', clients.size);

    res.json({
      success: true,
      message: 'WhatsApp Business account connected successfully!',
      clientId: clientId
    });

  } catch (error) {
    console.error('❌ Error in embedded signup:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to complete signup',
      details: error.response?.data || error.message
    });
  }
});

// ============================================
// 4. TEST SEND MESSAGE (GET /test-send)
// ============================================
app.get('/test-send', async (req, res) => {
  const { clientId, to, message, template } = req.query;

  if (!clientId || !to) {
    return res.status(400).json({
      error: 'Missing parameters',
      required: ['clientId', 'to']
    });
  }

  const client = clients.get(clientId);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  try {
    // Phone number ID from Meta WhatsApp API Setup
    const phoneNumberId = '1054543651068213';

    console.log(`\n📤 Sending message to ${to}...`);

    // Use template for first message, or text if within 24h window
    const useTemplate = req.query.template === 'true';
    
    const payload = useTemplate ? {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: 'hello_world',
        language: { code: 'en_US' }
      }
    } : {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: message }
    };

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${client.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Message sent successfully!');
    console.log('Response:', response.data);

    res.json({
      success: true,
      messageId: response.data.messages[0].id
    });

  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.response?.data || error.message
    });
  }
});

// ============================================
// 5. LIST CONNECTED CLIENTS (GET /clients)
// ============================================
app.get('/clients', (req, res) => {
  const clientList = Array.from(clients.entries()).map(([id, data]) => ({
    id,
    connectedAt: data.connectedAt,
    hasToken: !!data.accessToken
  }));

  res.json({
    total: clients.size,
    clients: clientList
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n🚀 WhatsApp Embedded Signup POC Server Running!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log('\n📋 Available endpoints:');
  console.log('  GET  /webhook              - Webhook verification');
  console.log('  POST /webhook              - Receive messages');
  console.log('  POST /embedded-signup      - OAuth callback');
  console.log('  GET  /test-send            - Send test message');
  console.log('  GET  /clients              - List connected clients');
  console.log('\n⚠️  Remember to:');
  console.log('  1. Create .env file from .env.example');
  console.log('  2. Fill in your Meta credentials');
  console.log('  3. Run ngrok to expose this server');
  console.log('  4. Configure webhook URL in Meta Business Manager');
  console.log('\n');
});
