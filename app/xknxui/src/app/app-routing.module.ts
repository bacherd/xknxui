import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoomViewComponent } from './room-view/room-view.component';

const routes: Routes = [
    { path: '', component: RoomViewComponent },
    { path: 'room/:spaceId', component: RoomViewComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
