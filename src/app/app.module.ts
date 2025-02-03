import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HomeModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
