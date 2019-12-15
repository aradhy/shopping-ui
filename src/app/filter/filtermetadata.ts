import { PriceFilterMetaData } from './pricefiltermetadata';
import { WeightFilterMetaData } from './weightfiltermetadata';
import { BrandFilterMetaData } from './brandfiltermetadata';

export class FilterMetaData
{

    
    priceFilters :Array<PriceFilterMetaData>=new Array<PriceFilterMetaData>()
    weightFilters :Array<WeightFilterMetaData>=new Array<WeightFilterMetaData>()
    brandFilters :Array<BrandFilterMetaData>=new Array<BrandFilterMetaData>()
    priceFlag:boolean=false;
    weightFlag:boolean=false;
    brandFlag:boolean=false;
    ifProdListEmpty:boolean=false;


}