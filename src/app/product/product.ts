import { CodeNode } from 'source-list-map';
import { ProductAvail } from './productavail';

export class Product {
    
	private  code:String;
   private name:String ;
   private brand:String ;
   private  imageLink:String;
   private subId:String ;
   private productAvailList:ProductAvail[];
 
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

  
	
}
