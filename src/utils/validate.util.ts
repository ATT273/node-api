import { IProductSkuPayload } from "../models/productSKUModel";

export const validateProductSKU = (data: IProductSkuPayload[]) => {
  let errorMessage = "";
  let index = -1;
  for (const item of data) {
    if (!item.sku) {
      errorMessage = "SKU is required";
      index = data.indexOf(item);
      break;
    }
    if (!item.price && item.price !== 0) {
      errorMessage = "Price is required";
      index = data.indexOf(item);
      break;
    }
    if (!item.qty && item.qty !== 0) {
      errorMessage = "Quantity is required";
      index = data.indexOf(item);
      break;
    }
  }
  return { errorMessage, index };
};
