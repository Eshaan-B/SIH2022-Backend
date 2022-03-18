const { db } = require("../config/db");
//const qldbController = require("../qldbTest");
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


// /api/trackers/fetchDetails
//TODO: Update this
const tracker_details = async (req, res) => {
  try {
    const { userId, applicationId } = req.params;
    const docRef = doc(db, `users/${userId}/applications/${applicationId}`);
    const trackerSnapshot = await getDoc(docRef);
    const tracker = trackerSnapshot.data();
    res.send(tracker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// /api/trackers/getTrackers
//GETTING APPLICATIONS OF A SPECIFIC USER
const tracker_indexUserTrackers = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const colRef = collection(db, `users/${userId}/applications`);
    const applicationSnapshot = await getDocs(colRef);
    const applicationList = applicationSnapshot.docs.map((doc) => doc.data());
    console.log(applicationList);
    console.log(`Fetched all application of ${userId}`);
    res.send(applicationList);
  } catch (err) {
    console.error(err.message);
  }
};
// /api/trackers/index
//TODO: Update this
const tracker_indexAll = async (req, res) => {
  try {
    const colRef = collection(db, "users");
    const trackerSnapshot = await getDocs(colRef);
    const trackerList = trackerSnapshot.docs.map((doc) => doc.data());
    res.send(trackerList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// /api/trackers/update
const tracker_update = async (req, res) => {
  try {
    const { userId, applicationId, trackerStatus } = req.body;
    const docRef = doc(db, `users/${userId}/applications/${applicationId}`);
    await updateDoc(docRef, { status: trackerStatus });
    res.send("Tracker updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// /api/trackers/new
const tracker_new = async (req, res) => {
  try {
    const { name, phone, userId } = req.body;
    const trackerRef = collection(db, `users/${userId}/applications`);
    const docRef = await addDoc(trackerRef, {
      name: name,
      phone: phone,
      status: "new",
      createdAt: serverTimestamp(),
    });
    console.log(`Pushed to user ${userId}`);
    console.log(docRef.id);
    //updating applicationID
    await updateDoc(doc(db, `users/${userId}/applications/${docRef.id}`), {
      applicationId: docRef.id,
    });
    console.log("Updated application ID");
    // updating to QLDB
    //await qldbController.insert(req.body);
    //console.log("Updated to QLDB");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// /api/trackers/delete
// TODO: fix deletion
const tracker_delete = async (req, res) => {
  try {
    const { userId, applicationId } = req.params;
    const docRef = doc(db, `users/${userId}/applications/${applicationId}`);
    //const docSnapshot = await getDoc(docRef);
    //console.log(docSnapshot.data);
    await deleteDoc(docRef);
    console.log("deleted");
    res.send("Tracker deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  tracker_indexAll,
  tracker_indexUserTrackers,
  tracker_details,
  tracker_update,
  tracker_new,
  tracker_delete,
};
