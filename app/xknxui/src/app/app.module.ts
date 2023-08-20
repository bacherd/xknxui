import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { ApiModule } from './apimodule/api.module';
import { BASE_PATH } from './apimodule/variables';

import { environment } from 'src/environments/environment';
import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoomNavigationComponent } from './room-navigation/room-navigation.component';
import { RoomNavigationSpaceComponent } from './room-navigation-space/room-navigation-space.component';
import { RoomViewComponent } from './room-view/room-view.component';

import { LightComponent } from './functions/light/light.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomNavigationComponent,
    RoomNavigationSpaceComponent,
    RoomViewComponent,
    LightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ApiModule,
  ],
  providers: [{ provide: BASE_PATH, useValue: environment.api_url }],
  bootstrap: [AppComponent]
})
export class AppModule { }
