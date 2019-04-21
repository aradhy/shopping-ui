export class ProductSelect {
    
	private  code:String;
    private quantity:String='1';

    constructor(private _code: string,private _quantity) {
this.code=_code;
this.quantity=_quantity;
    }
 
    getCode(): String {
       return this.code;
    }

    setCode(code:String) {
       this.code=code;
    }

    getQuantity(): String {
        return this.quantity;
     }
 
     setQuantity(quantity:String) {
        this.quantity=quantity;
     }

 
  
	
}
