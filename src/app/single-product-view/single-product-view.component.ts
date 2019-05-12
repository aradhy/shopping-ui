import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, ViewChild } from '@angular/core';


declare var customSingleImageView:any;


@Component({
    selector: 'app-single-product-view',
    templateUrl: './single-product-view.component.html',
    styleUrls: ['./single-product-view.component.css']
})



export class SingleProductViewComponent implements OnInit,AfterViewInit {
    ngAfterViewInit(): void {
        alert("before custom")
        
    }
    ngOnInit(): void {
        customSingleImageView();
    }

    

}
