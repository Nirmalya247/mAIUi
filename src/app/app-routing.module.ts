import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnRegressComponent } from './ann-regress/ann-regress.component';
import { AnnGraphComponent } from './ann-graph/ann-graph.component';

const routes: Routes = [
  { path: 'ann-regress', component: AnnRegressComponent },
  { path: 'ann-graph', component: AnnGraphComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }