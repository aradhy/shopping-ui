export class ProductSelect {
       
      code:string=null;
      selctedProdAvailCode:string=null;
      itemCount:string=null;

    
     constructor(_code:any,_quantity:any,_itemCount:any)
     {
          this.code=_code;
          this.selctedProdAvailCode=_quantity;
          this.itemCount=_itemCount;

     }


    getCode(): string {
       return this.code;
    }

    setCode(code:string) {
       this.code=code;
    }

    getSelctedProdAvail(): string {
        return this.selctedProdAvailCode;
     }
 
     setSelctedProdAvail(selctedProdAvail:string) {
        this.selctedProdAvailCode=selctedProdAvail;
     }

     setItemCount(itemCount:string)
     {
        this.itemCount=itemCount;
     }
  getItemCount()
  {
     return this.itemCount;
  }
	
}
