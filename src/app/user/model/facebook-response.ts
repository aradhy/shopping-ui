export class FacebookResponse {



status:string;
    constructor (private authToken:string, public name:string,public email:string,public socialProvider:string)
   {
this.name=name;
   }
}
