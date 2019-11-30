export class GoogleResponse {

   jwtExpiry:number;
      
   constructor (public access_token:string,public name:string,public email:string,public  provider:string)
   {

   }
   
   
   

}
