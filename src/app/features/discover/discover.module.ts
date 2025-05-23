import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverComponent } from './discover.component';

const routes: Routes = [
  { path: '', component: DiscoverComponent }
];

@NgModule({
  imports: [
    DiscoverComponent,
    RouterModule.forChild(routes)
  ]
})
export class DiscoverModule { }
