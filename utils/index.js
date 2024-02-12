const db = require("../config/db/index");

async function getCustId(custUUID) {
  try {
    const query = `
        SELECT cust_id
        FROM aidivaa.tbl_cust_master
        WHERE cust_uuid = $1
        AND is_hard_delete = false;
      `;
    const result = await db.queryDatabase(query, [custUUID]);
    console.log("custRes", result[0].cust_id);
    return result[0].cust_id;
  } catch (error) {
    console.log("1");
    console.error("Error executing database query:", error);
    throw error;
  }
}

async function getTentUserId(tentUserUUID) {
  try {
    const query = `
      SELECT tent_user_id 
      FROM aidivaa.tbl_tent_user 
      WHERE tent_user_uuid = $1 
      AND tent_user_status = true;
    `;
    const result = await db.queryDatabase(query, [tentUserUUID]);
    return result[0].tent_user_id;
  } catch (error) {
    console.log("2");
    console.error("Error executing database query:", error);
    throw error;
  }
}

async function getTentId(tentUUID) {
  try {
    const query = `
      SELECT tent_id 
      FROM aidivaa.tbl_tent_master 
      WHERE mast_tent_uuid = $1 
      AND tent_status = true;
    `;
    const result = await db.queryDatabase(query, [tentUUID]);
    return result[0].tent_id;
  } catch (error) {
    console.log("3");
    console.error("Error executing database query:", error);
    throw error;
  }
}

module.exports = {
  getCustId,
  getTentUserId,
  getTentId,
};
