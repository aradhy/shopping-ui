import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent_Menu } from './app_menu.component';

describe('App_MenuComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent_Menu
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent_Menu);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'MyFirstApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent_Menu);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('MyFirstApp');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent_Menu);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to MyFirstApp!');
  });
});
