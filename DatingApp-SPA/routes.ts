import { HomeComponent } from 'src/app/home/home.component';
import { Routes } from '@angular/router';
import { ListComponent } from 'src/app/list/list.component';
import { MemberListComponent } from 'src/app/members/member-list/member-list.component';
import { MessagesComponent } from 'src/app/messages/messages.component';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { MemberDetailComponent } from 'src/app/members/member-detail/member-detail.component';
import { MemberDetailResolver } from 'src/app/_resolvers/member-detail.resolver';
import { MemberListResolver } from 'src/app/_resolvers/member-list-resolver';
import { MemberEditComponent } from 'src/app/members/member-edit/member-edit.component';
import { MemberEditResolver } from 'src/app/_resolvers/member-edit.resolver';
import { PreventUnSavedChanges } from 'src/app/_guards/prevent-unsaved-changes.gaurd';
import { ListResolver } from 'src/app/_resolvers/list.resolver';
import {MessagesResolver} from 'src/app/_resolvers/messages.resolver';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ListComponent , resolve: {users: ListResolver}},
      {
        path: 'members',
        component: MemberListComponent,
        resolve: { users: MemberListResolver }
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver }
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnSavedChanges]
      },
      { path: 'messages', component: MessagesComponent , resolve: { messages: MessagesResolver }}
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
