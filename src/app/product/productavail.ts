import { CodeNode } from 'source-list-map';

export class ProductAvail {
    

   private  id:String;
	private productId:String ;
   private totalAvailUnits:number ;
   private price:number ;
   private weight:number;
   private weightUnit:String;

    getId(): String {
       return this.id;
    }

    setId(id:String) {
       this.id=id;
    }

    getProductId(): String {
      return this.productId;
   }

   setProductId(productId:String) {
      this.productId=productId;
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
