import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnnRegressComponent } from './ann-regress/ann-regress.component';
import { FormsModule } from '@angular/forms';
import { AnnGraphComponent } from './ann-graph/ann-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    AnnRegressComponent,
    AnnGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
