import { Product } from './Product';
import { BucketModel } from './bucketmodel';

export class BucketView {

    productFullInfoBucketMap:Map<string,BucketModel>;
    totalPrice:number=0;
    totalItemCount:number;

    public setProductFullInfoBucketMap(productFullInfoBucketMap:Map<string,BucketModel>)
    {
           this.productFullInfoBucketMap=productFullInfoBucketMap;
    }


    public getProductFullInfoBucketMap()
    {
        return   this.productFullInfoBucketMap;
    }


    public getTotalItems()
    {
        return   this.totalPrice;
    }


    public setTotalItems(totalPrice:number)
    {

        this.totalPrice=totalPrice;
       
    }


    public getTotalItemCount()
    {
        return   this.totalItemCount;
    }


    public setTotalItemCount(totalItemCount:number)
    {

        this.totalItemCount=totalItemCount;
       
    }
}
