export class ProductSelect {
    
	 private  code:String;
    private quantity:String;
    private itemCount:number;

    
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

     setItemCount(itemCount:number)
     {
        this.itemCount=itemCount;
     }
  getItemCount()
  {
     return this.itemCount;
  }
	
}
