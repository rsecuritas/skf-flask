import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { ThemeService } from '../../core/services/theme.service';

import { DOCUMENT } from '@angular/common';

import { ChecklistCategoryService } from '../../core/services/checklist_category.service';

@Component({
  selector: 'app-horizontaltopbar',
  templateUrl: './horizontaltopbar.component.html',
  styleUrls: ['./horizontaltopbar.component.scss'],
  providers: [ThemeService]
})

/**
 * Horizontal Topbar and navbar specified
 */
export class HorizontaltopbarComponent implements OnInit, AfterViewInit
{

  public element;
  public configData;
  public theme: string;
  public loggedinUser: string;
  public loggedin = false;
  public dark = false;
  public light = true;
  public menuItems = [];
  public categoryData: any = [];
  public routeUrl: any;
  public themeName: string;
  public search: string;
  
  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: any,
              private router: Router,
              // tslint:disable-next-line: variable-name
              private _checklistCategoryService: ChecklistCategoryService,
              private readonly joyride: JoyrideService,
              private themeService: ThemeService) {}

  ngOnInit(): void
  {
    this.element = document.documentElement;

    // this.initialize();

    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this._checklistCategoryService
      .getChecklistCategoryCollection()
      .subscribe(data => this.categoryData = data);

    this.themeName = sessionStorage.getItem('theme');
    this.changeTheme(this.themeName);
    if (this.themeName === 'dark-theme.css') {
      this.dark = true;
      this.light = false;
    } else {
      this.light = true;
      this.dark = false;
    }
  }

  ngAfterViewInit() {}

  /**
   * Togglemenu bar
   */
  toggleMenubar()
  {
    const element = document.getElementById('topnav-menu-content');
    element.classList.toggle('show');
  }

  /**
   * Change to Dark theme
   */
  toDark(theme: string)
  {
    this.themeService.editTheme(theme);
    this.dark = true;
    this.light = false;
    this.themeName = sessionStorage.getItem('theme');
    this.changeTheme(this.themeName);
  }

  /**
   * Change to Light theme
   */
  toLight(theme: string)
  {
    this.themeService.editTheme(theme);
    this.light = true;
    this.dark = false;
    this.themeName = sessionStorage.getItem('theme');
    this.changeTheme(this.themeName);
  }

  /**
   * Dynamic Theme
   */
  changeTheme(styleName: string)
  {
    const head = this.document.getElementsByTagName('head')[0];
    const themeLink = this.document.getElementById('dynamic-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'dynamic-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }

  /**
   * Tour
   */
  tour()
  {
    this.routeUrl = this.router.url;
    this.joyride.startTour({
      steps: ['stepDash', 'stepPro', 'stepCode', 'stepCheck',
              'stepKnow', 'stepUser', 'stepLab', 'firstStep@' + this.routeUrl,
              'secondStep', 'thirdStep', 'forthStep'], // stepid@routeurl
      showPrevButton: true,
      stepDefaultPosition: 'bottom',
      themeColor: '#000',
      showCounter: false,
    });
  }

 /**
  * Initialize
  */
  // initialize(): void
  // {
  //   this.menuItems = MENU;
  // }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  // hasItems(item: MenuItem)
  // {
  //   return item.subItems !== undefined ? item.subItems.length > 0 : false;
  // }

  platformUpdate(platform: string)
  {
    localStorage.setItem('categorySelector', platform);
    this.document.defaultView.location.reload();

  }

  onLogin()
  {
    this.router.navigate(['/auth/login']);
  }

  loggedIn()
  {
    this.loggedinUser = sessionStorage.getItem('Authorization');
    this.loggedin = true;
    return this.loggedinUser;
  }

  loggedOut()
  {
    sessionStorage.removeItem('Authorization');
    this.router.navigate(['/auth/login']);
  }

  onChange(search) {
    localStorage.setItem('search',search)
    this.router.navigate(['/search/index']);
  }

}
