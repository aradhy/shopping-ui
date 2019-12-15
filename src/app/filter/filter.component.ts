import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FilterMetaData } from './filterMetaData';
import { FilterParams } from './filterparams';
import { FilterService } from './filterservice';

import * as $ from 'jquery';
import { Category } from '../category/category';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BrandFilterMetaData } from './brandfiltermetadata';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
 
 
  @Output() filterParamsEmitter: EventEmitter<FilterParams> = new EventEmitter<FilterParams>();
  category:Category[];
  @Input() filterParams:FilterParams=new FilterParams();
  @Input()  catId:string;
  @Input() subId:string;
  filterMetaData:FilterMetaData=new FilterMetaData();
  brandFilters:Array<BrandFilterMetaData>=new Array<BrandFilterMetaData>();
  brandSearch = new FormControl('brandSearch');
 search:string;
  
  constructor(private filterService:FilterService) { }

  ngOnInit() {

 
 this.fetchMetaLeft();
    
  }
  


fetchMetaLeft()
{
  if(this.catId!=null)
  {
    let 
    params={
      'catId': this.catId
    }
    this.searchFilterUrl(params);
    this.getFilterMetaData(this.catId,null)
  }


if(this.catId!=null && this.subId!=null)
{
  let 
  params={
    'catId': this.catId,
    'subId': this.subId
  }
  this.searchFilterUrl(params);
  this.getFilterMetaData(this.catId,this.subId)
 }
}


handleSubCategoryUrl(catId,subId)
{

  this.filterParamsEmitter.emit(this.filterParams) 
  this.getFilterMetaData(catId,subId)
 
}

searchFilterUrl(params)
{

  this.filterService.getCategoriesFilters(params).subscribe(response =>
    {
   
      this.category = response;
  
    });
}


 
  handleBrand(event,brand)
  {

    if(event.target.checked)
    this.filterParams.brandFilters.push(brand.brandName)
    else
    this.removeBrand(brand)
   
    this.filterParamsEmitter.emit(this.filterParams)  
    
    if(this.catId!=null && this.subId!=null)
    {
    this.getFilterMetaData(this.catId,this.subId)
    }
    else
    {
    this.getFilterMetaDataSearch(this.search,this.filterParams)
    }
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
    
    if(this.catId!=null && this.subId!=null)
    {
    
    this.getFilterMetaData(this.catId,this.subId)
    }
    else
    {
    
    this.getFilterMetaDataSearch(this.search,this.filterParams)
    }
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
      if(this.catId!=null && this.subId!=null)
      this.getFilterMetaData(this.catId,this.subId)
      else
      this.getFilterMetaDataSearch(this.search,this.filterParams)
    }
    this.filterParamsEmitter.emit(this.filterParams)
  }

  getFilterMetaData(catId,subId)
  {
    let 
    params=null
    if(subId==null) 
    params={
      'catId': catId,
      'priceFilters':this.filterParams.priceFilters.join(", "),
      'weightFilters':this.filterParams.weightFilters.join(", "),
      'brandFilters':this.filterParams.brandFilters.join(", ")
    }
    else{
      params={
        'catId': catId,
        'subId': subId,
        'priceFilters':this.filterParams.priceFilters.join(", "),
        'weightFilters':this.filterParams.weightFilters.join(", "),
        'brandFilters':this.filterParams.brandFilters.join(", ")
      }
    }
    this.filterService.getFilterMetaData(params).subscribe(filterMetaData=>{
     
     
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
     if(this.filterMetaData.weightFilters!=null && this.filterMetaData.weightFilters.length>0)
     {
      let  packSizeLength=this.filterMetaData.weightFilters.length
      let heightPackSearch= Math.round(packSizeLength/2)*25
      $(".pack-size").css('height',heightPackSearch+'px')
     }

     if(this.filterMetaData.brandFilters!=null && this.filterMetaData.brandFilters.length>0)
     {
      let  brandSizeLength=this.filterMetaData.brandFilters.length
      let heightBrandSearch= Math.round(brandSizeLength/2)*25
      this.brandFilters=this.filterMetaData.brandFilters
      $(".brand").css('height',heightBrandSearch+'px')
     }
    }
    )
  }



  getFilterMetaDataSearch(search,filterParams)
  {
   this.search=search;
    this.filterService.getFilterSearchMetaData(search,filterParams).subscribe(filterMetaData=>{
     
     
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



  setCategorySubCategory(catId,subId)
  {
     this.catId=catId;
     this.subId=subId;
  }





  filterBrand(value)
  {
    value=value.target.value
    if(value.length==0)
    {
      this.brandFilters=this.filterMetaData.brandFilters
    }
   
  
    this.brandFilters= this.filterMetaData.brandFilters.filter(function(item) {
     
      return item.brandName.indexOf(value)>=0;
    });

  
  
    
  }


 

}
