import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'
import { BackslashNewlineSettingsTabComponent } from './settings-tab.component'

@Injectable()
export class BackslashNewlineSettingsTabProvider extends SettingsTabProvider {
    id = 'nv-shift-enter'
    icon = 'fas fa-keyboard'
    title = 'NV Shift Enter'
    weight = 10

    getComponentType() {
        return BackslashNewlineSettingsTabComponent
    }
}
