import { ProductSelect } from '../product/productselectview';

export class BucketView {

    
     productSelectViewMap: Map<string,ProductSelect>=new Map<string,ProductSelect>(); 
     totalItems:string=null;

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
