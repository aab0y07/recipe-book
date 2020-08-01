import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {AlertComponent} from './alert/alert.component';
import {DropdownDirective} from './dropdown.directive';


@NgModule({

    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective
    ], 
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropdownDirective, 
        CommonModule
    ]
})

export class SharedModule {

}