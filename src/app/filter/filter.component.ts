import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FilterMetaData } from './filterMetaData';
import { FilterParams } from './filterparams';
import { FilterService } from './filterservice';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
 
 
  @Output() filterParamsEmitter: EventEmitter<FilterParams> = new EventEmitter<FilterParams>();
 
  @Input() filterParams:FilterParams=new FilterParams();
  @Input()  catId:string;
  @Input() subId:string;
  filterMetaData:FilterMetaData=new FilterMetaData();
  
  constructor(private filterService:FilterService) { }

  ngOnInit() {
    alert(this.catId)
    alert(this.subId)
    this.getFilterMetaData()
    
  }
  
 
  handleBrand(event,brand)
  {

    if(event.target.checked)
    this.filterParams.brandFilters.push(brand)
    else
    this.removeBrand(brand)
   
    this.filterParamsEmitter.emit(this.filterParams)  
   this.getFilterMetaData()
  }

  removeBrand(brand)
  {
    
    var idx =  this.filterParams.brandFilters.indexOf(brand);
   
    this.filterParams.brandFilters.splice(idx, 1);
     
  }
  handlePrice(event,priceFilterMetaData)
  {
    if(priceFilterMetaData.v1==null && priceFilterMetaData.v2==null )
    {
      return;
    }
    if(priceFilterMetaData.v1==null && priceFilterMetaData.v2!=null)
    {
      if(event.target.checked)
      this.filterParams.priceFilters.push('<'+priceFilterMetaData.v1)
     else
     this.removePriceFilter('<'+priceFilterMetaData.v1);
    }
    else if(priceFilterMetaData.filterCriteria=='-')
    {
      if(event.target.checked)
      this.filterParams.priceFilters.push(priceFilterMetaData.v1+'-'+priceFilterMetaData.v2)
      else
      this.removePriceFilter(priceFilterMetaData.v1+'-'+priceFilterMetaData.v2);
    }
    this.filterParamsEmitter.emit(this.filterParams)
    this.getFilterMetaData()
  }

  handleWeight(event,weightFilterMetaData)
  {
  
    if(weightFilterMetaData.v1==null && weightFilterMetaData.v2==null )
    {
      return;
    }
    if(weightFilterMetaData.v1==null && weightFilterMetaData.v2!=null)
    {
      if(event.target.checked)
      this.filterParams.weightFilters.push('<'+weightFilterMetaData.v1+'-'+weightFilterMetaData.u1)
     else
     this.removeWeightFilter('<'+weightFilterMetaData.v1+'-'+weightFilterMetaData.u1);
    }
    else if(weightFilterMetaData.filterCriteria=='-')
    {
      if(event.target.checked)
      this.filterParams.weightFilters.push(weightFilterMetaData.v1+'-'+weightFilterMetaData.u1+'-'+weightFilterMetaData.v2+'-'+weightFilterMetaData.u2)
      else
      this.removeWeightFilter(weightFilterMetaData.v1+'-'+weightFilterMetaData.u1+'-'+weightFilterMetaData.v2+'-'+weightFilterMetaData.u2);
      this.getFilterMetaData()
    }
    this.filterParamsEmitter.emit(this.filterParams)
  
  }
  getFilterMetaData()
  {
    
    this.filterService.getFilterMetaData(this.catId,this.subId,this.filterParams).subscribe(filterMetaData=>{
     
     if(!filterMetaData.priceFlag && filterMetaData.priceFilters!=null)
      this.filterMetaData.priceFilters=filterMetaData.priceFilters
      if(!filterMetaData.brandFlag && filterMetaData.brandFilters!=null)
      this.filterMetaData.brandFilters=filterMetaData.brandFilters
      if(!filterMetaData.weightFlag && filterMetaData.weightFilters!=null)
      this.filterMetaData.weightFilters=filterMetaData.weightFilters
     
     
    }
    )
  }

  removePriceFilter(priceFilter)
  {
    var idx =  this.filterParams.priceFilters.indexOf(priceFilter);
    this.filterParams.priceFilters.splice(idx, 1);
    this.filterParamsEmitter.emit(this.filterParams)    
  }

  removeWeightFilter(priceFilter)
  {
    var idx =  this.filterParams.weightFilters.indexOf(priceFilter);
    this.filterParams.weightFilters.splice(idx, 1);
    this.filterParamsEmitter.emit(this.filterParams)    
  }
}
