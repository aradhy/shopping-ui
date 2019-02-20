import { CodeNode } from 'source-list-map';

export class Product {
    
	private  code:number;
	private name:String ;
	private price:number;

    protected created_date:Date;

	private  quantity:number;
	
    private category:String ;
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
     getQuantity(): number {
        return this.quantity;
     }
 
     setQuantity(quantity:number) {
        this.quantity=quantity;
     }

     getPrice(): number {
        return this.price;
     }
 
     setPrice(price:number) {
        this.price=price;
     }
     getCreatedDate(): Date {
        return this.created_date;
     }
 
     setCreatedDate(created_date:Date) {
        this.created_date=created_date;
     }
	
	
}
