import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    NgPipesModule
  ],
  exports: [
    NgPipesModule
  ]
})
export class PipesModule { }