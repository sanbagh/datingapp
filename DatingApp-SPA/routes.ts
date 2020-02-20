import { HomeComponent } from 'src/app/home/home.component';
import { Routes } from '@angular/router';
import { ListComponent } from 'src/app/list/list.component';
import { MemberListComponent } from 'src/app/members/member-list/member-list.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { MemberDetailComponent } from 'src/app/members/member-detail/member-detail.component';
import { MemberDetailResolver } from 'src/app/_resolvers/member-detail.resolver';
import { MemberListResolver } from 'src/app/_resolvers/member-list-resolver';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ListComponent },
      {
        path: 'member-list',
        component: MemberListComponent,
        resolve: { users: MemberListResolver }
      },
      {
        path: 'member-list/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver }
      },
      { path: 'messages', component: MessagesComponent }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
