// Make sure this runs after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Countdown Timer
  function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diff = endOfDay - now;
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const mins = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const secs = String(Math.floor((diff % (1000 * 60)) / 1000).padStart(2, '0');
    
    document.querySelectorAll('.countdown-timer').forEach(el => {
      el.textContent = "${hours}:${mins}:${secs}";
    });
  }
  
  if (document.querySelector('.countdown-timer')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Product Card Responsive Height
  function setEqualCardHeights() {
    if (window.innerWidth > 768) {
      const cards = document.querySelectorAll('.product-card');
      let maxHeight = 0;
      
      cards.forEach(card => {
        card.style.height = 'auto';
        if (card.offsetHeight > maxHeight) maxHeight = card.offsetHeight;
      });
      
      cards.forEach(card => {
        card.style.height = ${maxHeight}px;
      });
    } else {
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.height = 'auto';
      });
    }
  }
  
  window.addEventListener('resize', setEqualCardHeights);
  setEqualCardHeights();

  // Add to Cart functionality
  document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.new-price').textContent;
      
      // Here you would typically add to cart logic
      console.log(Added to cart: ${productName} - ${productPrice});
      
      // Optional: Show a toast notification
      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.textContent = Added ${productName} to cart;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    });
  });
});

// Add this to your CSS for the toast message
.toast-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

@keyfraames fadeInOut {
  0% { opacity: 0; bottom: 0; }
  15% { opacity: 1; bottom: 20px; }
  85% { opacity: 1; bottom: 20px; }
  100% { opacity: 0; bottom: 0; }
}
// Vendor Link Logic
document.addEventListener('DOMContentLoaded', function() {
  const vendorLink = document.getElementById('vendor-link');
  
  // Check auth state when page loads
  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, link to dashboard
        vendorLink.href = "vendor-dashboard.html";
        
        // Optional: Change text to "My Store"
        vendorLink.innerHTML = '<i class="fas fa-store"></i> My Store';
      } else {
        // User not logged in, link to login
        vendorLink.href = "vendor-login.html";
      }
    });
  }
});
// In checkout.html
document.getElementById('payment-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Show loading state
  document.getElementById('submit-payment').disabled = true;
  document.getElementById('submit-payment').innerHTML = 
    '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';

  try {
    // 1. Validate form data
    const paymentData = {
      cardNumber: document.getElementById('card-number').value,
      expiry: document.getElementById('expiry-date').value,
      cvv: document.getElementById('cvv').value,
      amount: document.getElementById('total-amount').value
    };

    // 2. Process payment (example using Stripe.js)
    const response = await fetch('/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (result.success) {
      // 3. On successful payment
      window.location.href = 'order-confirmation.html?order_id=' + result.orderId;
    } else {
      // Show error message
      alert('Payment failed: ' + result.message);
      document.getElementById('submit-payment').disabled = false;
      document.getElementById('submit-payment').innerHTML = 'Complete Payment';
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('An error occurred during payment processing');
    document.getElementById('submit-payment').disabled = false;
    document.getElementById('submit-payment').innerHTML = 'Complete Payment';
  }
});