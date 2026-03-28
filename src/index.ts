// src/index.ts - Tabby Shift+Enter plugin
import { NgModule, Injectable } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
    HotkeyDescription,
    HotkeyProvider,
    HotkeysService,
    AppService,
    ConfigProvider,
    ConfigService,
    BaseTabComponent
} from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'

import { BackslashNewlineSettingsTabComponent } from './settings-tab.component'
import { BackslashNewlineSettingsTabProvider } from './settings-tab-provider'

interface SplitTabComponent extends BaseTabComponent {
    getFocusedTab(): BaseTabComponent | null
    focusedTab?: BaseTabComponent
}

interface TerminalTab extends BaseTabComponent {
    session?: any
    frontend?: { write?: (data: string) => void }
    sendInput?: (data: string) => void
}

@Injectable()
export class BackslashNewlineConfigProvider extends ConfigProvider {
    defaults = {
        hotkeys: {
            'shift-enter-newline': ['Shift-Enter'],
        },
        backslashNewline: {
            customText: ' \\\n',
            includeBackslash: true,
        },
    }
}

@Injectable()
export class BackslashNewlineHotkeyProvider extends HotkeyProvider {
    async provide(): Promise<HotkeyDescription[]> {
        return [
            {
                id: 'shift-enter-newline',
                name: 'Send configured custom text',
            },
        ]
    }
}

@Injectable()
export class BackslashNewlineHandler {
    constructor(
        private hotkeys: HotkeysService,
        private app: AppService,
        private config: ConfigService
    ) {
        setTimeout(() => this.init(), 100)
    }

    private init() {
        this.hotkeys.matchedHotkey.subscribe(hotkey => {
            if (hotkey === 'shift-enter-newline') {
                this.handleBackslashNewline()
            }
        })
    }

    private handleBackslashNewline() {
        const activeTab = this.app.activeTab
        const terminal = this.getActiveTerminal(activeTab)
        if (terminal) {
            this.sendBackslashNewline(terminal)
        }
    }

    private getActiveTerminal(tab: BaseTabComponent | null): TerminalTab | null {
        if (!tab) {
            return null
        }

        const container = tab as any
        if (typeof container.getFocusedTab === 'function') {
            try {
                const focusedTab = container.getFocusedTab()
                if (focusedTab && this.isTerminalTab(focusedTab)) {
                    return focusedTab as TerminalTab
                }
            } catch (error) {
                console.error('getFocusedTab() failed:', error)
            }
        }

        if (this.isTerminalTab(tab)) {
            return tab as TerminalTab
        }

        return null
    }

    private isTerminalTab(tab: BaseTabComponent | null): boolean {
        if (!tab) return false
        const terminalTab = tab as any
        return !!(terminalTab.session || terminalTab.frontend || terminalTab.sendInput)
    }

    private sendBackslashNewline(tab: TerminalTab | BaseTabComponent | null) {
        if (!tab) {
            return
        }

        const terminalTab = tab as TerminalTab
        const includeBackslash = this.config.store?.backslashNewline?.includeBackslash ?? true
        let textToSend: string

        if (includeBackslash) {
            const customText = this.config.store?.backslashNewline?.customText || ' \\\n'
            textToSend = this.processEscapeSequences(customText)
        } else {
            textToSend = '\n'
        }

        try {
            if (terminalTab.session) {
                terminalTab.session.write(Buffer.from(textToSend, 'utf8'))
                return
            }

            if (terminalTab.frontend && terminalTab.frontend.write) {
                terminalTab.frontend.write(textToSend)
                return
            }

            if (typeof terminalTab.sendInput === 'function') {
                terminalTab.sendInput(textToSend)
                return
            }

            console.error('No available send method found')
        } catch (error) {
            console.error('Error sending backslash newline:', error)
        }
    }

    private processEscapeSequences(text: string): string {
        return text
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\r/g, '\r')
            .replace(/\\\\/g, '\\')
    }
}

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [BackslashNewlineSettingsTabComponent],
    providers: [
        {
            provide: ConfigProvider,
            useClass: BackslashNewlineConfigProvider,
            multi: true,
        },
        {
            provide: HotkeyProvider,
            useClass: BackslashNewlineHotkeyProvider,
            multi: true,
        },
        {
            provide: SettingsTabProvider,
            useClass: BackslashNewlineSettingsTabProvider,
            multi: true,
        },
        BackslashNewlineHandler,
    ],
})
export default class BackslashNewlineModule {
    constructor(private handler: BackslashNewlineHandler) {
    }
}
