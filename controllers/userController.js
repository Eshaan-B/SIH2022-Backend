const { auth, db } = require("../config/db");
const {
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  RecaptchaVerifier,
} = require("firebase/auth");

const {
  getDocs,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

const user_login = async (req, res) => {
  try {
    const { loginEmail, loginPass } = req.body;
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPass
    );
    console.log(userCredentials.user);
    res.send("User logged in.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// /api/users/signup
const user_register = async (req, res) => {
  try {
    const { loginEmail, loginPass } = req.body;
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      loginEmail,
      loginPass
    );
    //console.log(userCredentials.user);
    //adding user to firestore
    const usersRef = collection(db,"users");
    const docRef = await addDoc(usersRef, {
      email:loginEmail,
      
    });
    console.log(docRef.id);
    //updatingID
    await updateDoc(doc(db,`users/${docRef.id}`),{
      userId : docRef.id,
    })    
    res.send("New user registered.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const logout = async (req, res, next) => {
  try {
    await signOut(auth);
    console.log("User successfully logged out");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Logout error");
  }
  res.end();
};

const monitor_AuthState = async (req, res, next) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.displayName);
    } else {
      console.log("No user logged in");
    }
    res.end();
  });
};

const phoneSignIn = async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  user_register,
  user_login,
  logout,
  monitor_AuthState,
  phoneSignIn,
};
