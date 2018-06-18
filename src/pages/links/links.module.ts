import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinksPage } from './links';

@NgModule({
    declarations: [
        LinksPage,
    ],
    imports: [
        IonicPageModule.forChild(LinksPage),
    ],
    exports: [LinksPage],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class LinksPageModule {}
