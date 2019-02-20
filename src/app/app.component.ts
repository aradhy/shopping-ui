import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyFirstApp';
  changeText: boolean;

  arrBirds: any [] = [
    { name: 'Bells Sparrow' },
    { name: 'Mourning Dove'},
    { name: 'Bald Eagle' }
  ];
  

  public AppComponent()
  {
    this.changeText = false;

    alert('hello');
  }

 public  mouse_event(event)
  {
   var subMenu = [
      { name: 'submenu1' },
      { name: 'submenu2'},
      { name: 'submenu3' }
    ];
    
    return subMenu;
  }
}
