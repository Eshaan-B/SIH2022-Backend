const express = require("express");
const trackerController = require("../controllers/trackerController");

const router = express.Router();

// /api/trackers/........

router.get("/indexAll", trackerController.tracker_indexAll);
router.get("/indexUserApplications",trackerController.tracker_indexUserTrackers)
router.get("/:id", trackerController.tracker_details);
router.put("/update", trackerController.tracker_update);
router.post("/new", trackerController.tracker_new);
router.delete("/delete", trackerController.tracker_delete);
module.exports = router;
