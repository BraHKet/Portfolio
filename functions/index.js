const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Lista admin (sicura lato server)
const ADMIN_EMAILS = [
  'lore.mail.gl@gmail.com'
];

// Imposta custom claims quando un utente si registra
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  try {
    if (ADMIN_EMAILS.includes(user.email)) {
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      });
      console.log(`Admin claims set for: ${user.email}`);
    }
  } catch (error) {
    console.error('Error setting admin claims:', error);
  }
  return null;
});