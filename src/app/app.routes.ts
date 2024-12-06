import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { GuestHomeComponent } from './guest/home/home.component';
import { ManagerHomeComponent } from './manager/home/home.component';
import { ReceptionistHomeComponent } from './receptionist/home/home.component';
import { HousekeepingHomeComponent } from './housekeeping/home/home.component';
import { AdminHomeComponent } from './admin/home/home.component';
import { RoomListComponent } from './receptionist/components/room-list/room-list.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'guest', component: GuestHomeComponent, canActivate: [authGuard], data: { roles: ['Guest'] } },
  { path: 'manager', component: ManagerHomeComponent, canActivate: [authGuard], data: { roles: ['Manager'] } },
  { path: 'receptionist', component: ReceptionistHomeComponent, canActivate: [authGuard], data: { roles: ['Receptionist'] } },
  { path: 'housekeeping', component: HousekeepingHomeComponent, canActivate: [authGuard], data: { roles: ['Housekeeping'] } },
  { path: 'admin', component: AdminHomeComponent, canActivate: [authGuard], data: { roles: ['Admin'] } },
  { path: 'manage-rooms', component: RoomListComponent, canActivate: [authGuard], data: { roles: ['Manager', 'Receptionist'] } },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the landing page
];

export const appRouting = RouterModule.forRoot(routes);