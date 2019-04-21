import { CodeNode } from 'source-list-map';
import { ProductAvail } from './productavail';

export class Product {
    
	private  code:String;
   private name:String ;
   private brand:String ;
   private  imageLink:String;
   private subId:String ;
   public productAvailList:ProductAvail[];
   public selectedProductAvail:string="1";
   public quantityList:string[]=['1','2','3','4'];
   public selectedQuantity:string='1';




   public tryNewOne:string='Try New One';
   public tryNewOneList:string[]=['Price1','Price2','Price3','Price4'];
    getCode(): String {
       return this.code;
    }

    setCode(code:String) {
       this.code=code;
    }

    getName(): String {
        return this.name;
     }
 
     setName(name:String) {
        this.name=name;
     }
     getBrand(): String {
      return this.brand;
    }
    setBrand(brand: String) {
      return this.brand;
    }
    setImageId(imageLink: String) {
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
   

    setSelectedQuantity(selectedQuantity: string) {
      this.selectedQuantity=selectedQuantity;
    }
    getSelectedQuantity(): string {
      return this.selectedQuantity;
   }
   
   setQuantityList(quantityList: string[]) {
      this.quantityList=quantityList;
    }
    getQuantityList() {
     return this.quantityList;
    }
    setSelectedProductAvail(selectedProductAvail: string) {
      this.selectedProductAvail=selectedProductAvail;
    }
    getSelectedProductAvail():string {
     return this.selectedProductAvail;
    }
}
