const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function promote() {
  const email = process.argv[2];
  if (!email) {
    console.error('Please specify an email address. Example: node promoteAdmin.js admin@scholariq.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Database successfully.');

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error(`User with email "${email}" not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`🎉 Success! User "${user.name}" (${user.email}) has been promoted to Admin role.`);
  } catch (error) {
    console.error('Promotion failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

promote();
