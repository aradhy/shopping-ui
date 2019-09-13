import { OrderStatus } from './orderstatus';
import { OrderItem } from './orderitem';



export class CustomerOrder {
  public id:number;
  public  orderDetails:string;
  public orderStatusList=new Array<OrderStatus>();
  public orderItemList=new Array<OrderItem>();
}
