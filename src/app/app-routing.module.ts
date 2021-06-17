import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnRegressComponent } from './ann-regress/ann-regress.component';

const routes: Routes = [
  { path: 'ann-regress', component: AnnRegressComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
