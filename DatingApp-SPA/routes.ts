import { HomeComponent } from 'src/app/home/home.component';
import { Routes } from '@angular/router';
import { ListComponent } from 'src/app/list/list.component';
import { MemberListComponent } from 'src/app/member-list/member-list.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { AuthGuard } from 'src/app/_guards/auth.guard';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ListComponent },
      { path: 'member-list', component: MemberListComponent },
      { path: 'messages', component: MessagesComponent }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
