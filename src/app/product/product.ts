import { CodeNode } from 'source-list-map';

export class Product {
    
	private  code:number;
   private name:String ;
   private brand:String ;
   private  imageId:number;
   private created_date:Date;
   private categoryId:number ;
    getCode(): number {
       return this.code;
    }

    setCode(code:number) {
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
    setImageId(imageId: number) {
      this.imageId=imageId;
    }
    getImageId(): number {
      return this.imageId;
   }
   getCategoryId(): number {
      return this.categoryId;
   }

   setCategoryId(categoryId:number) {
      this.categoryId=categoryId;
   }

     getCreatedDate(): Date {
        return this.created_date;
     }
 
     setCreatedDate(created_date:Date) {
        this.created_date=created_date;
     }
	
	
}
