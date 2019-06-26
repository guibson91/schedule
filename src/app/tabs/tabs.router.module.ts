import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'rooms',
        children: [
          {
            path: '',
            loadChildren: '../pages/rooms/rooms.module#RoomsPageModule'
          }
        ]
      },
      {
        path: 'contacts',
        children: [
          {
            path: '',
            loadChildren: '../pages/contacts/contacts.module#ContactsPageModule'
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../pages/profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: 'event-detail',
        children: [
          {
            path: '',
            loadChildren: '../pages/event-detail/event-detail.module#EventDetailPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/rooms',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/rooms',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
