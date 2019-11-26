import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { EmptyComponent } from './empty.component';
import { AppPage1Component } from './pages/app-page-1.component';
import { AppPage2Component } from './pages/app-page-2.component';

const routes: Routes = [
  {
    path: 'angular',
    component: AppPage1Component
  },
  {
    path: 'angular-2',
    component: AppPage2Component
  },
  {
    path: 'both',
    component: AppPage1Component
  },
  {
    path: '**',
    component: EmptyComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
