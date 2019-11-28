import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyComponent } from './empty.component';
import { AppPage1Component } from './pages/app-page-1.component';
import { AppPage2Component } from './pages/app-page-2.component';

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { Store } from 'redux';

interface IAppState {
  todos: {
    todos: any[],
    total: number
  };
  dumb: {
    random: number;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    EmptyComponent,
    AppPage1Component,
    AppPage2Component
  ],
  imports: [
    NgReduxModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.provideStore(window.AppContext.get('applicationState') as Store<IAppState>);
  }
}
