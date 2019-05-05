import { ProductAvail } from './productavail';


export class Product {
    prodAvailId:string;
	 productCode:string;
    name:string ;
    brand:string ;
    imageLink:string;
    subId:string ;
    
   public productAvailList:ProductAvail[];
   public selectedProductAvail:ProductAvail;
   public itemCountList:number[]=[];
   public selectedItemCount:number=0;

   

    getCode(): String {
       return this.productCode;
    }

    setCode(productCode:string) {
       this.productCode=productCode;
    }

    getName(): String {
        return this.name;
     }
 
     setName(name:string) {
        this.name=name;
     }
     getBrand(): string {
      return this.brand;
    }
    setBrand(brand: string) {
      return this.brand;
    }
    setImageId(imageLink: string) {
      this.imageLink=imageLink;
    }
    getImageId(): String {
      return this.imageLink;
   }
   getSubCategoryId(): String {
      return this.subId;
   }
   setProductAvailList(productAvailList: ProductAvail[]) {
      this.productAvailList=productAvailList;
    }
    getProductAvailList() {
     return this.productAvailList;
    }
   

    setSelectedQuantity(selectedQuantity: number) {
      this.selectedItemCount=selectedQuantity;
    }
    getSelectedQuantity(): number {
      return this.selectedItemCount;
   }
   
   setQuantityList(quantityList: number[]) {
      this.itemCountList=quantityList;
    }
    getQuantityList() {
     return this.itemCountList;
    }
    setSelectedProductAvail(selectedProductAvail: ProductAvail) {
      this.selectedProductAvail=selectedProductAvail;
    }
    getSelectedProductAvail():ProductAvail {
     return this.selectedProductAvail;
    }
}
