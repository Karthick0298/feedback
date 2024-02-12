const router = require("express-promise-router")();
const feedbackController = require("../controllers/Feedback/microsite_feeback.controller");

router.post("/microsite/savefeedback/:tentId", feedbackController.saveFeedback);
router.get(
  "/microsite/getfeedback/:tentId/:custId/:feedbackId?",
  feedbackController.listAllFeedback
);

module.exports = router;
