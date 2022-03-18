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
  setDoc,
} = require("firebase/firestore");

const user_login = async (req, res) => {
  try {
    const { loginEmail, loginPass } = req.body;
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPass
    );
    const uid = userCredentials.user.uid;
    console.log(uid);
    res.send(uid);
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
    const uid = userCredentials.user.uid;
    const docRef = await setDoc(doc(db, "users", uid), req.body);
    //updatingID
    await updateDoc(doc(db, `users/${uid}`), {
      uid: uid,
    });
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

const getAllUsers = async (req,res,next) => {
  try{
    const colRef = collection(db,"users");
    const userSnapshot = await getDocs(colRef);
    const userList = userSnapshot.docs.map((doc)=>doc.data());
    console.log(userList);
    res.send(userList);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  user_register,
  user_login,
  logout,
  monitor_AuthState,
};
