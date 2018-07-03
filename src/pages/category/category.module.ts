import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CategoryPage} from './category';

@NgModule({
    declarations: [
        CategoryPage,
    ],
    imports: [
        IonicPageModule.forChild(CategoryPage),
    ],
    exports: [CategoryPage],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CategoryPageModule {
}
