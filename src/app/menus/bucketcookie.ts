import { ProductSelect } from '../product/productselectview';

export class CookieBucket {

    
     productSelectViewMap: Map<string,ProductSelect>=new Map<string,ProductSelect>(); 
     totalItems:number=0;
     totalPrice:number;

      setProductSelectViewMap(productSelectViewMap:Map<string,ProductSelect>)
      {
          this.productSelectViewMap=productSelectViewMap;
      }

      getProductSelectMapView()
      {
          return this.productSelectViewMap;
      }

      setTotalItems(totalItems:number)
      {
          this.totalItems=totalItems;
      }

      getTotalItems()
      {
          return this.totalItems;
      }

}
