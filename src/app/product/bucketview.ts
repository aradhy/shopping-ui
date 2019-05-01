import { Product } from './product';

export class BucketView {

    productFullInfoBucketMap:Map<string,Product>;
    totalPrice:number;
    totalItemCount:number;

    public setProductFullInfoBucketMap(productFullInfoBucketMap:Map<string,Product>)
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
