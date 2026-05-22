const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'smartstore' });
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data.');

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@smartstore.com',
      password: 'admin123',
    });
    await admin.save();
    console.log('👤 Admin user created: admin@smartstore.com / admin123');

    // Create dummy products
    const products = [
      {
        name: 'Wireless Earbuds X',
        category: 'Electronics',
        price: 99.99,
        stock: 45,
        description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life.',
        seoTags: ['wireless earbuds', 'noise cancelling', 'bluetooth earphones', 'premium audio', 'long battery'],
        marketingCaption: '🎧 Cut the cord, not the quality. Wireless Earbuds X — your sound, unleashed.',
        salesData: { unitsSold: 230, revenue: 22997 },
        createdBy: admin._id,
      },
      {
        name: 'Smart Watch Pro',
        category: 'Wearables',
        price: 249.99,
        stock: 12,
        description: 'Advanced smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display.',
        seoTags: ['smartwatch', 'fitness tracker', 'health monitor', 'GPS watch', 'AMOLED display'],
        marketingCaption: '⌚ Your health, your schedule, your style — all on your wrist.',
        salesData: { unitsSold: 156, revenue: 38998 },
        createdBy: admin._id,
      },
      {
        name: 'Ergonomic Keyboard',
        category: 'Accessories',
        price: 129.50,
        stock: 0,
        description: 'Split-design ergonomic mechanical keyboard with customizable RGB backlighting.',
        seoTags: ['ergonomic keyboard', 'mechanical keyboard', 'RGB keyboard', 'split keyboard', 'typing comfort'],
        marketingCaption: '⌨️ Type smarter, not harder. Your wrists will thank you.',
        salesData: { unitsSold: 89, revenue: 11525 },
        createdBy: admin._id,
      },
      {
        name: 'Ultra HD Monitor 27"',
        category: 'Electronics',
        price: 449.00,
        stock: 28,
        description: '4K UHD IPS monitor with 99% sRGB coverage, USB-C connectivity, and adjustable stand.',
        seoTags: ['4K monitor', 'UHD display', 'IPS monitor', 'USB-C monitor', 'professional display'],
        marketingCaption: '🖥️ See every detail. The Ultra HD Monitor brings your work to life.',
        salesData: { unitsSold: 67, revenue: 30083 },
        createdBy: admin._id,
      },
      {
        name: 'Portable Power Bank 20000mAh',
        category: 'Accessories',
        price: 39.99,
        stock: 120,
        description: 'High-capacity portable charger with dual USB-A and USB-C fast charging support.',
        seoTags: ['power bank', 'portable charger', 'fast charging', 'USB-C charger', '20000mAh battery'],
        marketingCaption: '🔋 Never run out of juice. Power through your day with 20000mAh.',
        salesData: { unitsSold: 412, revenue: 16475 },
        createdBy: admin._id,
      },
      {
        name: 'Noise Cancelling Headphones',
        category: 'Electronics',
        price: 199.99,
        stock: 8,
        description: 'Over-ear headphones with adaptive noise cancellation and premium memory foam cushions.',
        seoTags: ['noise cancelling headphones', 'over-ear headphones', 'premium headphones', 'wireless headphones', 'ANC'],
        marketingCaption: '🎶 Silence the world. Hear only what matters.',
        salesData: { unitsSold: 178, revenue: 35598 },
        createdBy: admin._id,
      },
      {
        name: 'Laptop Stand Adjustable',
        category: 'Accessories',
        price: 49.99,
        stock: 5,
        description: 'Aluminum adjustable laptop stand with ventilation for heat dissipation and ergonomic viewing.',
        seoTags: ['laptop stand', 'adjustable stand', 'aluminum stand', 'ergonomic stand', 'desk accessory'],
        marketingCaption: '💻 Elevate your setup. Work smarter with the perfect viewing angle.',
        salesData: { unitsSold: 95, revenue: 4749 },
        createdBy: admin._id,
      },
      {
        name: 'Bluetooth Speaker Mini',
        category: 'Electronics',
        price: 29.99,
        stock: 200,
        description: 'Compact waterproof Bluetooth speaker with 360° sound and 12-hour playtime.',
        seoTags: ['bluetooth speaker', 'portable speaker', 'waterproof speaker', 'mini speaker', '360 sound'],
        marketingCaption: '🔊 Small speaker. Massive sound. Take the party anywhere.',
        salesData: { unitsSold: 520, revenue: 15594 },
        createdBy: admin._id,
      },
    ];

    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded.`);

    // Fetch the inserted products to use their IDs for orders
    const insertedProducts = await Product.find({});
    
    // Create dummy orders
    const orders = [
      {
        orderId: 'ORD-7829',
        customer: { name: 'Alex Johnson', email: 'alex@example.com' },
        items: [{ product: insertedProducts[0]._id, quantity: 1, price: 99.99 }],
        totalAmount: 99.99,
        status: 'Delivered',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
      },
      {
        orderId: 'ORD-7828',
        customer: { name: 'Sarah Williams', email: 'sarah@example.com' },
        items: [{ product: insertedProducts[1]._id, quantity: 1, price: 249.99 }],
        totalAmount: 249.99,
        status: 'Processing',
        createdAt: new Date()
      },
      {
        orderId: 'ORD-7827',
        customer: { name: 'Michael Chen', email: 'michael@example.com' },
        items: [{ product: insertedProducts[3]._id, quantity: 1, price: 449.00 }],
        totalAmount: 449.00,
        status: 'Shipped',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
      },
      {
        orderId: 'ORD-7826',
        customer: { name: 'Emily Davis', email: 'emily@example.com' },
        items: [{ product: insertedProducts[6]._id, quantity: 2, price: 49.99 }],
        totalAmount: 99.98,
        status: 'Delivered',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3))
      },
      {
        orderId: 'ORD-7825',
        customer: { name: 'Robert Wilson', email: 'robert@example.com' },
        items: [{ product: insertedProducts[5]._id, quantity: 1, price: 199.99 }],
        totalAmount: 199.99,
        status: 'Cancelled',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4))
      }
    ];

    await Order.insertMany(orders);
    console.log(`🛒 ${orders.length} orders seeded.`);

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
