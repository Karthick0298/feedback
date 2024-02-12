const db = require("../../config/db/index");
const { body, validationResult } = require("express-validator");
const _ = require("lodash");
const { getCustId, getTentUserId, getTentId } = require("../../utils/index");

// Validation middleware
const validateFeedback = [
  body("tent_user_uuid")
    .exists()
    .withMessage("Tent user UUID is required")
    .isString()
    .withMessage("Tent user UUID must be a string")
    .isLength({ min: 8, max: 8 })
    .withMessage("Tent user UUID must be 8 characters long")
    .not()
    .isEmpty()
    .withMessage("Tent user UUID cannot be empty or null"),

  body("cust_uuid")
    .exists()
    .withMessage("Customer UUID is required")
    .isString()
    .withMessage("Customer UUID must be a string")
    .isLength({ min: 8, max: 8 })
    .withMessage("Customer UUID must be 8 characters long")
    .not()
    .isEmpty()
    .withMessage("Customer UUID cannot be empty or null"),

  body("is_recommend")
    .exists()
    .withMessage("Recommendation status is required")
    .isBoolean()
    .withMessage("Recommendation status must be a boolean")
    .not()
    .isEmpty()
    .withMessage("Recommendation status cannot be empty or null"),

  body("feedback_star")
    .exists()
    .withMessage("Feedback star rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Feedback star rating must be between 1 and 5")
    .not()
    .isEmpty()
    .withMessage("Feedback star rating cannot be empty or null"),

  body("feedback_description")
    .exists()
    .withMessage("Feedback description is required")
    .isString()
    .withMessage("Feedback description must be a string")
    .isLength({ min: 1, max: 1000 })
    .withMessage(
      "Feedback description must be between 1 and 1000 characters long"
    )
    .not()
    .isEmpty()
    .withMessage("Feedback description cannot be empty or null"),
];
// tentId =
exports.saveFeedback = [
  validateFeedback,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), status: "failure" });
    }
    const {
      tent_user_uuid,
      feedback_star,
      is_recommend,
      feedback_description,
      cust_uuid,
    } = req.body;
    // const tent_id = req.params.tentId;
    const tent_uuid = req.params.tentId;
    const created_by = 1;
    if (
      !_.isEqual(typeof cust_uuid, "string") &&
      !_.isEqual(typeof tent_user_uuid, "string")
    ) {
      return res
        .status(400)
        .json({ message: "Invalid cust_uuid format", status: "failure" });
    }
    try {
      const [tent_user_id, cust_id, tent_id] = await Promise.all([
        getTentUserId(tent_user_uuid),
        getCustId(cust_uuid),
        getTentId(tent_uuid),
      ]);
      if (tent_user_id && cust_id && tent_id) {
        const result = await db.queryDatabase(
          "INSERT INTO aidivaa.tbl_tent_feedback (tent_user_id, feedback_star, is_recommend, feedback_description, cust_id, created_on, created_by, tent_id) VALUES ($1, $2, $3, $4, $5, now(), $6, $7)",
          [
            tent_user_id,
            feedback_star,
            is_recommend,
            feedback_description,
            cust_id,
            created_by,
            tent_id,
          ]
        );
        if (result) {
          res.status(201).send({
            message: "Feedback added successfully!",
            status: "success",
          });
        }
      } else {
        res.status(400).send({
          message: "Exists!",
          status: "failure",
        });
      }
    } catch (error) {
      console.error("Error executing database query:", error);
      res.status(500).send({
        message: "Internal server error",
        status: "failure",
      });
    }
  },
];

//get all feedback

exports.listAllFeedback = async (req, res) => {
  try {
    const tent_feedback_uuid = req.params.feedbackId;
    const tent_uuid = req.params.tentId;
    const cust_uuid = req.params.custId;
    const [cust_id, tent_id] = await Promise.all([
      getCustId(cust_uuid),
      getTentId(tent_uuid),
    ]);
    if (tent_feedback_uuid) {
      const response = await db.queryDatabase(
        "SELECT feedback_description, tent_feedback_uuid, feedback_star, is_recommend, created_on FROM aidivaa.tbl_tent_feedback WHERE tent_feedback_uuid = $1 ORDER BY created_on DESC",
        [tent_feedback_uuid]
      );
      const totalReviews = response.length;
      let totalStar = 0;
      response.forEach((item) => {
        totalStar += item.feedback_star;
      });
      const avgStar = totalStar / totalReviews;
      res.status(200).send({
        status: "success",
        message: "Data fetched success",
        data: {
          total_reviews: totalReviews,
          avg_star: avgStar,
          data: response,
        },
      });
    } else {
      const response = await db.queryDatabase(
        "SELECT tcm.cust_name, ttf.feedback_description, ttf.tent_feedback_uuid, ttf.feedback_star, ttf.is_recommend, ttf.created_on FROM aidivaa.tbl_tent_feedback ttf join aidivaa.tbl_cust_master tcm  on ttf.cust_id = tcm.cust_id and tcm.is_hard_delete is false WHERE tcm.tent_id = $1 and tcm.cust_id =$2 ORDER BY created_on DESC",
        [tent_id, cust_id]
      );
      const totalReviews = response.length;
      let totalStar = 0;
      response.forEach((item) => {
        totalStar += item.feedback_star;
      });
      const avgStar = totalStar / totalReviews;
      res.status(200).send({
        status: "success",
        message: "Data fetched success",
        data: {
          total_reviews: totalReviews,
          avg_star: avgStar,
          data: response,
        },
      });
    }
  } catch (error) {
    console.error("Error executing database query:", error);
    res.status(500).send({
      message: "Internal server error",
      status: "failure",
    });
  }
};

//selected feedback by uuid
exports.findFeedbackById = async (req, res) => {};
