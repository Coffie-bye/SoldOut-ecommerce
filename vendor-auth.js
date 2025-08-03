// Vendor Authentication System

// ======================
// Authentication Functions
// ======================

/**
 * Register a new vendor
 * @param {string} email - Vendor's email
 * @param {string} password - Vendor's password
 * @param {string} businessName - Vendor's business name
 */
async function registerVendor(email, password, businessName) {
  try {
    // Validate inputs
    if (!email || !password || !businessName) {
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create user account
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    
    // Send email verification
    await userCredential.user.sendEmailVerification({
      url: `${window.location.origin}/vendor-login.html`
    });

    // Save vendor details to Firestore
    await firebase.firestore().collection('vendors').doc(userCredential.user.uid).set({
      email: email,
      businessName: businessName,
      status: 'pending',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: null,
      role: 'vendor'
    });

    // Show success message
    showToast('Registration successful! Please check your email for verification.', 'success');
    
    // Redirect to login after delay
    setTimeout(() => {
      window.location.href = 'vendor-login.html';
    }, 3000);

  } catch (error) {
    console.error('Registration error:', error);
    showToast(`Registration failed: ${error.message}`, 'error');
  }
}

/**
 * Login an existing vendor
 * @param {string} email - Vendor's email
 * @param {string} password - Vendor's password
 */
async function loginVendor(email, password) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Sign in user
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await firebase.auth().signOut();
      throw new Error('Please verify your email before logging in. Check your inbox.');
    }

    // Update last login timestamp
    await firebase.firestore().collection('vendors').doc(userCredential.user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Redirect to dashboard
    window.location.href = 'vendor-dashboard.html';

  } catch (error) {
    console.error('Login error:', error);
    showToast(`Login failed: ${error.message}`, 'error');
  }
}

/**
 * Send password reset email
 * @param {string} email - Vendor's email
 */
async function sendPasswordReset(email) {
  try {
    if (!email) {
      throw new Error('Please enter your email address');
    }

    await firebase.auth().sendPasswordResetEmail(email);
    showToast('Password reset email sent! Please check your inbox.', 'success');

  } catch (error) {
    console.error('Password reset error:', error);
    showToast(`Error: ${error.message}`, 'error');
  }
}

/**
 * Logout current vendor
 */
async function logoutVendor() {
  try {
    await firebase.auth().signOut();
    window.location.href = 'vendor-login.html';
  } catch (error) {
    console.error('Logout error:', error);
    showToast(`Logout failed: ${error.message}`, 'error');
  }
}

// ======================
// Auth State Management
// ======================

/**
 * Initialize auth state listener
 */
function initializeAuthState() {
  firebase.auth().onAuthStateChanged(async (user) => {
    const currentPath = window.location.pathname;
    
    if (user) {
      // User is signed in
      if (!user.emailVerified && !currentPath.includes('vendor-login.html')) {
        await firebase.auth().signOut();
        window.location.href = 'vendor-login.html';
        return;
      }
      
      // Load vendor data if on dashboard
      if (currentPath.includes('vendor-dashboard.html')) {
        await loadVendorData(user.uid);
      }
      
    } else {
      // No user signed in
      if (!currentPath.includes('vendor-login.html') && 
          !currentPath.includes('vendor-register.html')) {
        window.location.href = 'vendor-login.html';
      }
    }
  });
}

/**
 * Load vendor data for dashboard
 * @param {string} uid - Vendor's user ID
 */
async function loadVendorData(uid) {
  try {
    const doc = await firebase.firestore().collection('vendors').doc(uid).get();
    
    if (doc.exists) {
      const vendorData = doc.data();
      
      // Update UI elements
      if (document.getElementById('vendor-name')) {
        document.getElementById('vendor-name').textContent = vendorData.businessName;
      }
      if (document.getElementById('vendor-email')) {
        document.getElementById('vendor-email').textContent = vendorData.email;
      }
      if (document.getElementById('join-date') && vendorData.createdAt) {
        const joinDate = vendorData.createdAt.toDate();
        document.getElementById('join-date').textContent = 
          joinDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
      }
    }
  } catch (error) {
    console.error('Error loading vendor data:', error);
    showToast('Error loading profile data', 'error');
  }
}

// ======================
// Helper Functions
// ======================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success/error)
 */
function showToast(message, type = 'success') {
  // Create toast element if it doesn't exist
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = `toast ${type}`;
    document.body.appendChild(toast);
  }
  
  // Update toast content and style
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  
  // Hide after 5 seconds
  setTimeout(() => {
    toast.style.display = 'none';
  }, 5000);
}

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeAuthState();
});

// Make functions available globally
window.registerVendor = registerVendor;
window.loginVendor = loginVendor;
window.sendPasswordReset = sendPasswordReset;
window.logoutVendor = logoutVendor;