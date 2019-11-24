export class FacebookResponse {


public name:string;
public email:string;
status:string;
    constructor (private authToken:string, name:string,private socialProvider:string)
   {
this.name=name;
   }
}
