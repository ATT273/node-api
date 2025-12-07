import Inventory, { IInventoryPayload } from "../models/inventoryModel";
import { errorCode } from "../constants/error_code";

export const getInventoryList = async (req, res) => {
  try {
    const inventories = await Inventory.getList(req.query);
    if (!inventories) {
      res.status(404).json({ status: 404, message: "No inventory found", errorCode: errorCode.COMMON.NOT_FOUND });
      return;
    }
    res.status(200).json({ status: 200, data: inventories });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message, errorCode: errorCode.COMMON.SERVER_ERROR });
  }
};

export const getInventoriesByType = async (req, res) => {
  const { type } = req.params;
  try {
    const inventories = await Inventory.getList({ ...req.query, type });

    if (!inventories) {
      res.status(404).json({ status: 404, message: errorCode.COMMON.NOT_FOUND });
      return;
    }
    res.status(200).json({ status: 200, data: inventories });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const createInventory = async (req, res) => {
  const data: IInventoryPayload = req.body;
  try {
    const inventory = await Inventory.storeInventory(data);
    res.status(200).json({ status: 200, message: "success", data: inventory });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const getInventoryDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory: any = await Inventory.findById(id)
      .populate({
        path: "skuId",
        select: "sku productId",
        populate: {
          path: "productId",
          select: "name",
        },
      })
      .lean();

    if (!inventory) {
      res.status(404).json({ status: 404, message: errorCode.COMMON.NOT_FOUND });
      return;
    }

    const inventoryDetail = {
      ...inventory,
      id: inventory._id,
      skuId: inventory.skuId._id,
      skuCode: inventory.skuId.sku,
      productName: inventory.skuId.productId.name,
      productId: inventory.skuId.productId._id,
      refOrderId: inventory.refOrderId || null,
    };

    res.status(200).json({ status: 200, data: inventoryDetail, message: "Success" });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ status: 404, message: "Invalid id. No inventory found" });
      return;
    }
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { skuId, qtyChange, note, changeType } = req.body;

  try {
    // Check if inventory exists
    const existedInventory = await Inventory.findById(id);
    if (!existedInventory) {
      res
        .status(404)
        .json({ status: 404, message: "Invalid id. No inventory found", errorCode: errorCode.COMMON.NOT_FOUND });
      return;
    }

    // Validate required fields
    if (!skuId) {
      res
        .status(400)
        .json({ status: 400, message: "skuId is required", errorCode: errorCode.INVENTORY.SKUID_REQUERIED });
      return;
    }
    if (!changeType) {
      res
        .status(400)
        .json({ status: 400, message: "changeType is required", errorCode: errorCode.INVENTORY.CHANGE_TYPE_REQUIRED });
      return;
    }
    if (qtyChange === undefined || qtyChange === null) {
      res
        .status(400)
        .json({ status: 400, message: "qtyChange is required", errorCode: errorCode.INVENTORY.QTY_CHANGE_REQUIRED });
      return;
    }
    if (qtyChange < 0) {
      res.status(400).json({
        status: 400,
        message: "qtyChange must be positive",
        errorCode: errorCode.INVENTORY.QTY_CHANGE_POSITIVE,
      });
      return;
    }

    // Validate changeType
    const validChangeTypes = ["SALES", "IMPORT", "ADJUSTMENT", "RETURN"];
    if (!validChangeTypes.includes(changeType)) {
      res.status(400).json({
        status: 400,
        message: `changeType must be one of: ${validChangeTypes.join(", ")}`,
        errorCode: errorCode.INVENTORY.INVALID_CHANGE_TYPE,
      });
      return;
    }

    // Update inventory
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      {
        skuId,
        qtyChange,
        changeType,
        note: note || "",
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 200,
      message: "Inventory updated successfully",
      data: updatedInventory,
    });
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ status: 404, message: "Invalid id. No inventory found", errorCode: errorCode.COMMON.NOT_FOUND });
      return;
    }
    if (error.name === "ValidationError") {
      res.status(400).json({ status: 400, message: error.message });
      return;
    }
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const _existedInventory = await Inventory.findById({ _id: id });
    if (!_existedInventory) {
      res.status(404).json({ status: 404, message: errorCode.COMMON.NOT_FOUND });
      return;
    }
    await Inventory.deleteOne({ _id: id });
    res.status(200).json({ status: 200, message: "Inventory has been deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ status: 404, message: "Invalid id. No inventory found", errorCode: errorCode.COMMON.NOT_FOUND });
      return;
    }
    res.status(500).json({ status: 500, message: error.message, errorCode: errorCode.COMMON.SERVER_ERROR });
  }
};
