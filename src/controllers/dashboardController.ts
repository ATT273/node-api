import Inventory from "../models/inventoryModel";

export const getDashboardSummary = async (req, res) => {
  try {
    const result = await Inventory.getList(req.query);
    const inventories = result.data;
    let summary = {};
    if (result.data.length > 0) {
      summary = inventories.reduce((acc, curr) => {
        const type = curr.changeType;
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += curr.qtyChange;
        acc["TOTAL"] = (acc["TOTAL"] || 0) + curr.qtyChange;
        return acc;
      }, {});
      res.status(200).json({ status: 200, data: summary });
      return;
    }
    res.status(200).json({ status: 200, data: inventories });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
