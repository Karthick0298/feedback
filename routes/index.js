const express = require("express");

const router = express.Router();

router.get("/api", async (req, res) => {
  try {
    res.status(200).send({
      status: true,
      message: "Data detched succesfuly",
      data: [],
    });
  } catch (error) {
    console.error("Error executing database query:", error);
    res.status(500).send({
      message: "Internal server error",
      status: "failure",
    });
  }
});

module.exports = router;
