import { Component, OnInit, Input, EventEmitter, Output, Inject, AfterViewInit, HostListener, ElementRef, NgModule } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { SubCategory } from '../category/sub-category';
import { NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductSelect } from '../product/productselectview';
import { CookieBucket } from './bucketcookie';
import { ProductService } from '../product/product.service';
import { Subscription, of } from 'rxjs';
import { map, startWith, debounceTime, catchError, switchMap, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
import { SharedService } from '../sharedservice.service';
import { Product } from '../product/Product';
import { ProductAvail } from '../product/productavail';
import { BucketView } from '../product/bucketview';
import { BucketModel } from '../product/bucketmodel';
import * as $ from 'jquery';
import { SearchProduct } from '../product/search-product';

import { UserComponent } from '../user/user.component';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AppService } from '../app-service';
import { MenuService } from './menu-service';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  providers: [CookieService]
})
@NgModule({
  imports: [MatDialogModule]
})
export class MenusComponent implements OnInit, AfterViewInit {
  rest: boolean;
  ngAfterViewInit(): void {
    var toolTop = parseInt($(".imageCart").position().top) + parseInt($(".imageCart").css("height")) + 18;

    $(".tooltiptext").css({ "top": toolTop + 'px' })
  }




  @Input() bucketView: BucketView;
  @Input() customerName: string = null;
  @Output() restEmitter = new EventEmitter<boolean>();
  public categoryList: Category[];
  public categoryListAll: Category[];
  public subCategoryList: SubCategory[];
  private subscription: Subscription;
  search = new FormControl('search');
  testFlag: boolean = false;
  productSearchList: SearchProduct[];
  prodSearchDropItems: Product[];
  currentUrl: string;
  currentUserName: string = null;
  isUser: Boolean;
  @Output() nameEvent = new EventEmitter<string>();

  @Output() resetEmitter = new EventEmitter<boolean>();

  @Output() searchClicked = new EventEmitter<any>();

  @Output() getUserNameFromMenu = new EventEmitter<string>();
  COOKIE_BUCKET_ID: string = "DefaultBucket"

  resetFilter() {
    $('.mainCat').hide();

    this.resetEmitter.emit(true)

  }

  constructor(private categoryService: CategoryService, private router: Router, private sharedSerevice: SharedService
    , private productService: ProductService, public el: ElementRef, private appService: AppService,private menuService:MenuService) {


    this.subscription = this.sharedSerevice.getState().subscribe(bucketView => {

      this.bucketView = bucketView
      if (this.bucketView.totalItemCount < 10) {
        $(".cart-count").css("right", "7.2em")
      }
      else {
        $(".cart-count").css("right", "7.5em")
      }

    });



  }


  restProductFilter() {
    this.rest = true;
    this.sharedSerevice.setResetAll(this.rest)


  }


  ngOnInit() {

    this.search = new FormControl();
    let userStorage = localStorage.getItem("USER");

    let defaultBucketString = localStorage.getItem(this.COOKIE_BUCKET_ID);
    
    if (this.appService.checkForNullONullString(userStorage)) {
      let userInfo = JSON.parse(localStorage.getItem("USER"));    
      if (userInfo.userId != null)
        this.COOKIE_BUCKET_ID = userInfo.userId;
        let userBucketString=localStorage.getItem(userInfo.userId)
        this.menuService.mergeFromDefaultBucket(userInfo.userId,userBucketString,defaultBucketString); 
        localStorage.setItem('DefaultBucket',null);
    }
    this.onchange();
    this.showCart();




  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    console.log(window.pageYOffset)

    if (window.pageYOffset > 20) {

      $(".menucomp").css({ top: '0px' });
      $('.menucomp').css('box-shadow', '2px 2px 2px #ddd')
      var toolTop = parseInt($(".imageCart").position().top) + parseInt($(".imageCart").css("height")) - parseInt($(".menucomp").css("top")) - 10;

      $(".tooltiptext").css({ top: toolTop + 'px' })

    }
    else {

      $(".menucomp").css({ top: '2em' });
      $('.menucomp').css('box-shadow', '')
      var toolTop = parseInt($(".imageCart").position().top) + parseInt($(".imageCart").css("height")) + parseInt($(".menucomp").css("top")) - 10;

      $(".tooltiptext").css({ top: toolTop + 'px' })
    }


  }

  colorGrey(id) {

    $("#" + id).css("background-color", "#ddd");
  }


  colorWhite(id) {

    $("#" + id).css("background-color", "#ffffff");

  }
  fetchUser() {
    let userInfo = JSON.parse(localStorage.getItem("USER"));

    if (localStorage.getItem("USER") != null) {
      let tokenExpired = (userInfo.jwtExpiry - (Date.now() / 1000));
      if (userInfo.userName != null && tokenExpired) {

        this.currentUserName = userInfo.userName;
      }


    }

  }



  collapse() {

    $(".dropdown").slideUp("fast")
  }


  displayBucket(id) {
    $(".tooltiptext").hide()

    if (this.appService.checkForNullONullString(localStorage.getItem("USER"))) {
      this.router.navigateByUrl('/checkout')
    }
    else {


      let dialogRef = this.appService.openDialog('signUpId');
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        this.currentUserName = result.data;

        if (this.currentUserName != null) {
          this.getUserNameFromMenu.emit(this.currentUserName);
          $(".noUser").hide();
          $(".hasUser").show();
        }
      });

    }



  }






  onchange() {

    this.search.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(value => value ? this.productBasedSearch(value) : of([]
      )

      )
    ).subscribe(productList => {
      this.productSearchList = productList
      console.log(this.productSearchList)
      this.prodSearchDropItems = new Array<Product>()
      this.productSearchList.forEach(productSearch => {

        productSearch.prod.productAvailList.forEach(prodAvail => {
          let product = new Product()
          product.code = productSearch.prod.code;
          product.catId = productSearch.catId
          product.subId = productSearch.prod.subId
          product.imageLink = productSearch.prod.imageLink
          product.name = productSearch.prod.name
          product.selectedProductAvail = prodAvail
          this.prodSearchDropItems.push(product)

        }

        )

      }
      )
      this.testFlag = false
    });

  }


  productBasedSearch(name) {

    let
      params = {

        'search': name

      }

    if (name.length > 2) {

      this.testFlag = true
      var productObserv = this.productService.productBasedOnName(params)

      return productObserv;
    }
    else {

      return of([]);
    }

  }


  displayCart() {

    $(".tooltiptext").show()

  }
  searchProduct() {

    var productSearch = this.search.value;

    if (productSearch == null) {
      return;
    }


    if (productSearch != '')
      this.router.navigate(['product-name'], { queryParams: { 'search': productSearch } });

  }

  mouse_event() {

    this.categoryService.getCategories().subscribe(response => {

      this.categoryList = response;
      console.log('Category From DB')

    });


    return this.categoryList;

  }

  colorHoverGrey(categoryId) {
    $("#" + 'cat' + categoryId).css("background-color", "#ddd");
  }

  mouse_event_sub(categoryId) {


    this.categoryService.getSubCategories(categoryId).subscribe(response => {


      this.subCategoryList = response;
      console.log('SubCategory From DB')



    });


    return this.subCategoryList;
  }

  removeFromBucket(x: string) {

    var selectedCount = this.bucketView.productFullInfoBucketMap.get(x).selectedItemCount;
    this.bucketView.totalItemCount = (this.bucketView.totalItemCount) - parseInt(selectedCount);
    this.bucketView.totalPrice = this.bucketView.totalPrice - (parseInt(selectedCount) * this.bucketView.productFullInfoBucketMap.get(x).price)
    this.bucketView.productFullInfoBucketMap.delete(x);
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(x, 0, this.bucketView.totalItemCount, this.bucketView.totalPrice)
  }

  addQty(selectedProdAvail: any) {

    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount = parseInt(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount) + 1 + ''
    this.bucketView.totalItemCount = this.bucketView.totalItemCount + 1;
    this.bucketView.totalPrice = this.bucketView.totalPrice + (this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail, this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount, this.bucketView.totalItemCount, this.bucketView.totalPrice)
  }

  subQty(selectedProdAvail: any, selectedItemCount: number) {

    if (selectedItemCount > 0) {

      this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount = (parseInt(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount) - selectedItemCount) + ''
      let updatedCountProdAvail = this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount
      this.bucketView.totalPrice = this.bucketView.totalPrice - (1 * this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)

      this.bucketView.totalItemCount = (this.bucketView.totalItemCount) - selectedItemCount
      if (updatedCountProdAvail == '0') {
        this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail)

      }

      this.sharedSerevice.setSet(this.bucketView);
      this.updateCookieBucket(selectedProdAvail, updatedCountProdAvail, this.bucketView.totalItemCount, this.bucketView.totalPrice)

    }


  }

  updateCookieBucket(selectedProdAvail: any, selectedItemCount: any, totalItemCount: any, totalPrice: any) {


    if (this.appService.checkForNullONullString(localStorage.getItem(this.COOKIE_BUCKET_ID))) {
      var cookieBucketString = localStorage.getItem(this.COOKIE_BUCKET_ID);
      var cookieBucket = this.fetchbucketfrombucketstring(cookieBucketString);
      var productSelectViewMap = this.fetchmapfrombucketstring(cookieBucket);

      cookieBucket.totalItems = totalItemCount;
      cookieBucket.totalPrice = totalPrice;



      if (selectedItemCount == 0) {
        productSelectViewMap.delete(selectedProdAvail)

      }
      else {

        productSelectViewMap.get(selectedProdAvail).itemCount = selectedItemCount
      }

      cookieBucket.productSelectViewMap = productSelectViewMap

    }
    else {
      this.bucketView.totalItemCount = 0;
    }
    localStorage.setItem(this.COOKIE_BUCKET_ID, this.ObjectToJsonString(cookieBucket));
  }

  
  updateItemCount(selectedProdAvail: string, selectedItemCount: any) {

    var cookieBucketString = localStorage.getItem(this.COOKIE_BUCKET_ID);
    var cookieBucket = this.fetchbucketfrombucketstring(cookieBucketString);
    var productSelectViewMap = this.fetchmapfrombucketstring(cookieBucket);


    if (selectedItemCount == null || selectedItemCount == '') {
      selectedItemCount = 1;
      this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount = '1';
    }

    this.bucketView.totalItemCount = (this.bucketView.totalItemCount) - (parseInt(productSelectViewMap.get(selectedProdAvail).itemCount) - parseInt(selectedItemCount))

    this.bucketView.totalPrice = this.bucketView.totalPrice - (((parseInt(productSelectViewMap.get(selectedProdAvail).itemCount) - parseInt(selectedItemCount)) * this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price))

    if (selectedItemCount == 0) {

      this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail);

    }

    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail, selectedItemCount, this.bucketView.totalItemCount, this.bucketView.totalPrice)

  }





  fetchbucketfrombucketstring(bucketItemString: string): CookieBucket {

    var bucketViewFromString = JSON.parse(bucketItemString);
    return bucketViewFromString;

  }

  fetchmapfrombucketstring(bucketViewFromString: any): Map<string, ProductSelect> {

    var map = new Map<string, ProductSelect>(JSON.parse(bucketViewFromString.productSelectViewMap));
    //bucketViewFromString.productSelectViewMap = null;
    return map;
  }

  ObjectToJsonString(bucketItem: CookieBucket): string {

    var bucketString = JSON.stringify(bucketItem, function (key, value) {

      if (value instanceof (Map)) {
        return JSON.stringify(Array.from(value))
      } else {
        return value;
      }
    });


    return bucketString;

  }



  compareFn(pAv1: ProductAvail, pAv2: ProductAvail): boolean {
    return pAv1 && pAv2 ? pAv1.id === pAv2.id : pAv1 === pAv2;
  }



  showCart() {


    this.bucketView = new BucketView();
    this.bucketView.productFullInfoBucketMap = new Map<string, BucketModel>();


    if (this.appService.checkForNullONullString(localStorage.getItem(this.COOKIE_BUCKET_ID))) {



      var cookieBucketString = localStorage.getItem(this.COOKIE_BUCKET_ID);
      var cookieBucket = this.fetchbucketfrombucketstring(cookieBucketString);
      var productSelectViewMap = this.fetchmapfrombucketstring(cookieBucket);
      this.bucketView.totalItemCount = cookieBucket.totalItems;
      this.bucketView.totalPrice = cookieBucket.totalPrice
      var keyString = Array.from(productSelectViewMap.keys()).join()
      var productList;

      this.productService.bucketProductInfo(keyString).subscribe(response => {

        productList = response;
        productList.forEach(product => {

          var productSelect = productSelectViewMap.get(product.prodAvailId);
          product.selectedItemCount = productSelect.itemCount;

          this.bucketView.productFullInfoBucketMap.set(product.prodAvailId, product);

        });

      });


    }
    else {
      this.bucketView.totalItemCount = 0;
    }


  }








}
