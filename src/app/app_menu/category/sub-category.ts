import { Product} from './../product/Product';
export class SubCategory {

    public name: String;
    public id: number;
    private description:String;
    public imageLink:String;
    private imageId:number;
    private  productList:Product[];
    
    public getCategory_id(): number {
        return this.id;
    }
    public setCategory_id(category_id: number) {
        this.id = category_id;
    }
    public getName(): String {
        return this.name;
    }
    public setName(name: String) {
        this.name = name
    }

    public getDescription(): String {
        return this.description;
    }
    public setDescription(description: String) {
        this.description = description
    }

    public getImageLink(): String {
        return this.imageLink;
    }

    public setImageId(imageId: number) {
        this.id = imageId;
    } 

    public setImageLink(imageLink: string) {
        this.imageLink = imageLink;
    }

    public getImageId(): number {
        return this.imageId;
    }
    public getProduct():Product[]
    {
        return this.productList;
    }
   
    public setProduct(productList: Product[]) {
        this.productList = productList;
    }
}
