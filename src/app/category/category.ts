
export class Category {
     name: String;
    private category_id: number;
    
    public getCategory_id(): number {
        return this.category_id;
    }
    public setCategory_id(category_id: number) {
        this.category_id = category_id;
    }
    public getName(): String {
        return this.name;
    }
    public setName(name: String) {
        this.name = name
    }
   
}