// auth.js
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function registerVendor(email, password, vendorData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Send email verification
    await sendEmailVerification(userCredential.user);

    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: vendorData.businessName,
    });

    // Save vendor details to Firestore
    await setDoc(doc(db, "vendors", userCredential.user.uid), {
      ...vendorData,
      email: email,
      emailVerified: false,
      createdAt: new Date(),
      status: "pending", // For admin approval
    });

    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginVendor(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      await auth.signOut();
      throw new Error("Please verify your email before logging in.");
    }

    // Additional check for vendor status in Firestore
    const vendorDoc = await getDoc(doc(db, "vendors", userCredential.user.uid));
    if (!vendorDoc.exists() || vendorDoc.data().status !== "approved") {
      await auth.signOut();
      throw new Error("Vendor account not approved yet.");
    }

    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
