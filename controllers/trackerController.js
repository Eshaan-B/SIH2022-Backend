const { db } = require("../config/db");
//const qldbController = require("../qldbTest");
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const qldb = require('amazon-qldb-driver-nodejs');
const { log } = require('console');
const https = require('https');
// ----------------------------------------------------------
//Replace this value as appropriate for your application
const maxConcurrentTransactions = 50;

const agentForQldb = new https.Agent({
    "keepAlive": true,
    //Set this to the same value as `maxConcurrentTransactions`(previously called `poolLimit`)
    //Do not rely on the default value of `Infinity`
    "maxSockets": maxConcurrentTransactions
});
const serviceConfiguration = { "httpOptions": {
  "agent": agentForQldb
}};

let driver = new qldb.QldbDriver("sample", serviceConfiguration, maxConcurrentTransactions);

//----------------------------------------------------------
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
    console.log("Tracker updated");
    //updating in qldb
    // await driver.executeLambda(async(txn)=>{
    //   await txn.execute("UPDATE ApplicationTracker SET status = ? where appId = ?","","")
    // })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// /api/trackers/new
const tracker_new = async (req, res) => {
  try {
    
    const trackerRef = collection(db, `users/${userId}/applications`);
    const docRef = await addDoc(trackerRef, req.body);
    console.log(`Pushed ${docRef.id}`);
    //updating applicationID
    await updateDoc(doc(db, `users/${userId}/applications/${docRef.id}`), {
      applicationId: docRef.id,
    });
    console.log("Updated application ID");

    // updating to QLDB
    //TODO: MAKE QLDB schema and upload req.body to it
    // await driver.executeLambda(async (txn)=>{
    //   const data = {
    //     applicationId:"005",
    //     description:"Testing1",
    //     status:"InProgress"
    //   }
    //   await txn.execute("INSERT INTO applications ?",data);
    //   console.log("QLDB updated");
    //   res.send("Successful")
    // })
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
  //tracker_indexUserTrackers,
  tracker_details,
  tracker_update,
  tracker_new,
  tracker_delete,
};
