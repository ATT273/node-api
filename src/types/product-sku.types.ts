export interface IProductSkuImage {
  id: string;
  name: string;
  url: string;
  productImageId: number;
}
export interface IProductSkuImagePayload extends Omit<IProductSkuImage, "id"> {
  id?: string;
}
