export class SubCategory {

    name: String;
    private id: number;
    
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
}
