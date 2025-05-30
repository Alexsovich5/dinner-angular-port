import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';

const routes: Routes = [
  { path: ':id', component: ChatComponent }
];

@NgModule({
  imports: [
    ChatComponent,
    RouterModule.forChild(routes)
  ]
})
export class ChatModule { }
