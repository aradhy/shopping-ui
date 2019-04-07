import { CodeNode } from 'source-list-map';

export class Product {
    
	private  code:String;
   private name:String ;
   private brand:String ;
   private  imageLink:String;
   private categoryId:number ;
   private price:number;
   private weight:number;
   private weightUnit:String;
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
   getCategoryId(): number {
      return this.categoryId;
   }

   setPrice(price:number) {
      this.price=price;
   }

   getPrice(): number {
      return this.price;
   }

   setWeight(weight:number) {
      this.weight=weight;
   }
   getWeight(weight:number) {
      return this.weight;
   }
   setWeightUnit(weightUnit:string) {
      this.weightUnit=weightUnit;
   }
   getWeightUnit() {
      return this.weightUnit;
   }
	
	
}
