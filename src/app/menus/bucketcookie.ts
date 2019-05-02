import { ProductSelect } from '../product/productselectview';

export class CookieBucket {

    
     productSelectViewMap: Map<string,ProductSelect>=new Map<string,ProductSelect>(); 
     totalItems:string=null;
     totalPrice:number;

      setProductSelectViewMap(productSelectViewMap:Map<string,ProductSelect>)
      {
          this.productSelectViewMap=productSelectViewMap;
      }

      getProductSelectMapView()
      {
          return this.productSelectViewMap;
      }

      setTotalItems(totalItems:string)
      {
          this.totalItems=totalItems;
      }

      getTotalItems()
      {
          return this.totalItems;
      }

}
