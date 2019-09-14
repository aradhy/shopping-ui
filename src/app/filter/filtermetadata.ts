import { PriceFilterMetaData } from './pricefiltermetadata';
import { WeightFilterMetaData } from './weightfiltermetadata';

export class FilterMetaData
{

    
    priceFilters :Array<PriceFilterMetaData>=new Array<PriceFilterMetaData>()
    weightFilters :Array<WeightFilterMetaData>=new Array<WeightFilterMetaData>()
    brandFilters :Array<string>=new Array<string>()
    priceFlag:boolean=false;
    weightFlag:boolean=false;
    brandFlag:boolean=false;
    ifProdListEmpty:boolean=false;


}