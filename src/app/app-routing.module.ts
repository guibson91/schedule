import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  //ROOT PAGE
  { path: '',loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },

  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  
  // { path: 'event-create', loadChildren: './pages/event-create/event-create.module#EventCreatePageModule' },
  // { path: 'event-detail', loadChildren: './pages/event-detail/event-detail.module#EventDetailPageModule' },
  // { path: 'rooms', loadChildren: './pages/rooms/rooms.module#RoomsPageModule', canActivate: [AuthGuard] },
  // { path: 'contacts', loadChildren: './pages/contacts/contacts.module#ContactsPageModule', canActivate: [AuthGuard] },
  // { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  // { path: 'calendar', loadChildren: './pages/calendar/calendar.module#CalendarPageModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }