import { Address } from 'src/app/delivery/address';

export class TokenDTO {
    userId:string;
    userName:string;
    jwtToken:string;
    csrfToken:string;
    jwtExpiry:number;
    provider:string;
    addressList:Address[];

}
