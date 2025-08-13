// In your component or page
import { registerVendor, loginVendor } from "./auth";

// Example registration
async function handleRegister() {
  try {
    const vendorData = {
      businessName: "My Store",
      phone: "123-456-7890",
      address: "123 Main St",
    };

    await registerVendor(email, password, vendorData);
    alert("Registration successful! Please check your email for verification.");
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  }
}

// Example login
async function handleLogin() {
  try {
    await loginVendor(email, password);
    window.location.href = "/vendor-dashboard";
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}
