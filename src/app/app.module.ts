import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { BillingModule } from './billing/billing.module';
import { ProductModule } from './product/product.module';
import { ReservationModule } from './reservation/reservation.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceModule } from './service/service.module';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ScheduleModule } from './schedule/schedule.module';
import { DatePipe } from '@angular/common';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { BranchModule } from './branch/branch.module';

@NgModule({
  declarations: [AppComponent],
  // TO DO modules [all in bd]
  imports: [
    //module order
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    
    CoreModule,
    ShareModule,
    HomeModule,
    ProductModule,
    UserModule,
    BillingModule,
    ReservationModule,
    ServiceModule,

    AppRoutingModule,
    CalendarModule,
    ScheduleModule,
    BranchModule,


  ],
  providers: [provideAnimationsAsync(), DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
