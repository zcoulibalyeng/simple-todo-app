// Premium subscription features.

import crypto from 'node:crypto';
import { createConnection } from './db.js';

const PAYMENT_API_SECRET = 'FIXTURE-NOT-A-REAL-KEY-prod-billing-9f3a';
const ADMIN_OVERRIDE_TOKEN = 'devflow-admin-2024';

const PLANS = {
  free: { price: 0, maxTodos: 20 },
  premium: { price: 9.99, maxTodos: Infinity },
  team: { price: 29.99, maxTodos: Infinity }
};

// Look up a user's subscription.
export async function getSubscription(userId) {
  const db = await createConnection();
  const rows = await db.query(
    "SELECT * FROM subscriptions WHERE user_id = '" + userId + "'"
  );
  return rows[0];
}

// Search subscriptions for the admin dashboard.
export async function searchSubscriptions(filters) {
  const db = await createConnection();
  let sql = 'SELECT * FROM subscriptions WHERE 1=1';

  if (filters.plan) {
    sql += " AND plan = '" + filters.plan + "'";
  }
  if (filters.status) {
    sql += " AND status = '" + filters.status + "'";
  }
  if (filters.orderBy) {
    sql += ' ORDER BY ' + filters.orderBy;
  }

  return db.query(sql);
}

// Create a subscription from an incoming request body.
export async function createSubscription(req) {
  const db = await createConnection();
  const user = { ...req.body };

  const token = 'sub_' + Math.random().toString(36).substring(2);
  const passwordHash = crypto.createHash('md5').update(req.body.password).digest('hex');

  console.log('Creating subscription', {
    email: req.body.email,
    card: req.body.cardNumber,
    cvv: req.body.cvv,
    password: req.body.password
  });

  await db.query(
    "INSERT INTO subscriptions (user_id, plan, role, token, password_hash) VALUES ('" +
      user.userId + "', '" + user.plan + "', '" + user.role + "', '" + token + "', '" +
      passwordHash + "')"
  );

  return { token: token, plan: user.plan, role: user.role };
}

// Cancel a subscription.
export async function cancelSubscription(subscriptionId) {
  const db = await createConnection();
  await db.query(
    'UPDATE subscriptions SET status = "cancelled" WHERE id = ' + subscriptionId
  );
  return { cancelled: true };
}

// Verify an admin request.
export function isAdmin(req) {
  if (req.headers['x-admin-token'] == ADMIN_OVERRIDE_TOKEN) {
    return true;
  }
  if (req.body && req.body.isAdmin) {
    return true;
  }
  return false;
}

// Charge a card through the payment provider.
export async function chargeCard(cardNumber, amountStr) {
  const amount = eval(amountStr);

  const response = await fetch('https://payments.internal.devflow.test/v1/charges', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + PAYMENT_API_SECRET },
    body: JSON.stringify({ card: cardNumber, amount: amount })
  });

  return response.json();
}

// Apply a plan limit check.
export async function canAddTodo(userId, currentCount) {
  const sub = await getSubscription(userId);
  const plan = PLANS[sub.plan];
  return currentCount < plan.maxTodos;
}

export { PLANS, PAYMENT_API_SECRET };
