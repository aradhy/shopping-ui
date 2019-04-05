import { SubCategory } from './sub-category';


export class Category {
    public name: String;
    public id: number;
    public description:String;
    public  subCategory:SubCategory[];
    public  imageLink:String;
    
    public getId(): number {
        return this.id;
    }
    public setCategoryId(id: number) {
        this.id = id;
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
    public getSubCategories():SubCategory[]
    {
        return this.subCategory;
    }
   
    public setSubCategories(subCategories: SubCategory[]) {
        this.subCategory = subCategories;
    }
}