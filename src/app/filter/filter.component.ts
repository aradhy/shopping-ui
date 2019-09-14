import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FilterMetaData } from './filterMetaData';
import { FilterParams } from './filterparams';
import { FilterService } from './filterservice';
import { Category } from '../app_menu/category/category';
import * as $ from 'jquery';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
 
 
  @Output() filterParamsEmitter: EventEmitter<FilterParams> = new EventEmitter<FilterParams>();
  category:Category;
  @Input() filterParams:FilterParams=new FilterParams();
  @Input()  catId:string;
  @Input() subId:string;
  filterMetaData:FilterMetaData=new FilterMetaData();
 
  
  constructor(private filterService:FilterService) { }

  ngOnInit() {

    this.filterService.getCategoriesFilters(this.catId,this.subId).subscribe(response =>
      {
      
        this.category = response;
    
      });
    this.getFilterMetaData(this.catId,this.subId)

    
  }
  
handleSubCategoryUrl(catId,subId)
{

  this.filterParamsEmitter.emit(this.filterParams) 
  this.getFilterMetaData(catId,subId)
}

 
  handleBrand(event,brand)
  {

    if(event.target.checked)
    this.filterParams.brandFilters.push(brand.brandName)
    else
    this.removeBrand(brand)
   
    this.filterParamsEmitter.emit(this.filterParams)  
    
   this.getFilterMetaData(this.catId,this.subId)
  }

  removeBrand(brand)
  {
    
    var idx =  this.filterParams.brandFilters.indexOf(brand.brandName);
   
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
    this.getFilterMetaData(this.catId,this.subId)
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
      this.getFilterMetaData(this.catId,this.subId)
    }
    this.filterParamsEmitter.emit(this.filterParams)
  
  }
  getFilterMetaData(catId,subId)
  {

    this.filterService.getFilterMetaData(catId,subId,this.filterParams).subscribe(filterMetaData=>{
     
     
      if(filterMetaData.priceFilters==null)
      {
        this.filterMetaData.priceFilters=[];
      }
       if(filterMetaData.brandFilters==null)
      {
        this.filterMetaData.brandFilters=[];
      }
    
     if(filterMetaData.weightFilters==null)
      {
        this.filterMetaData.weightFilters=[];
      }
      if(filterMetaData.brandFilters!=null && filterMetaData.priceFilters!=null && filterMetaData.weightFilters!=null)
      this.filterMetaData=filterMetaData;
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

  resetAll() {
   $(".pricename").prop('checked', false);
   $(".brandname").prop('checked', false);
   $(".weightname").prop('checked', false);
   this.filterParams.brandFilters=[]
   this.filterParams.priceFilters=[]
   this.filterParams.weightFilters=[]

   this.filterParamsEmitter.emit(this.filterParams)
   this.getFilterMetaData(this.catId,this.subId)
  }
}
