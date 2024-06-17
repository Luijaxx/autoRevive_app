import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { HttpClientModule } from '@angular/common/http'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  // TO DO modules [all in bd]
  imports: [
    //module order 
    BrowserModule,
    HttpClientModule, 
    CoreModule,
    ShareModule,
    HomeModule,
    UserModule,
    // router manager
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
