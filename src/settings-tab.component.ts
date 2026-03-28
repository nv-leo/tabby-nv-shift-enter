import { Component } from '@angular/core'
import { ConfigService, LocaleService } from 'tabby-core'

const TRANSLATIONS = {
    en: {
        title: 'NV Shift Enter Settings',
        toggleLabel: 'Include backslash before newline',
        toggleHint: 'When enabled, sends the custom text below. When disabled, sends only a newline character.',
        customTextLabel: 'Custom Text to Send:',
        customTextPlaceholder: 'Enter custom text (e.g., \\\\\\n)',
        customTextHint: 'Enter the text to send when hotkey is pressed. Use \\\\n for newline, \\\\t for tab, \\\\\\\\ for backslash.',
        savedMessage: '✓ Settings saved automatically',
        resetButton: 'Reset',
        previewLabel: 'Preview:',
        howToTitle: 'How to use:',
        howToSteps: [
            'Toggle backslash inclusion above',
            'Configure your custom text if backslash is enabled',
            'Go to Settings → Hotkeys',
            'Find "Send configured custom text"',
            'Set your preferred hotkey (default: Shift+Enter)',
            'Press the hotkey in any terminal to send the configured text',
        ],
    },
    ja: {
        title: 'NV Shift Enter 設定',
        toggleLabel: '改行前にバックスラッシュを含める',
        toggleHint: '有効時は下のカスタムテキストを送信します。無効時は改行文字のみを送信します。',
        customTextLabel: '送信するカスタムテキスト:',
        customTextPlaceholder: 'カスタムテキストを入力 (例: \\\\\\n)',
        customTextHint: 'ホットキー押下時に送信するテキストを入力してください。\\\\n で改行、\\\\t でタブ、\\\\\\\\ でバックスラッシュを表します。',
        savedMessage: '✓ 設定を自動保存しました',
        resetButton: 'リセット',
        previewLabel: 'プレビュー:',
        howToTitle: '使い方:',
        howToSteps: [
            '上のトグルでバックスラッシュの有無を切り替える',
            'バックスラッシュが有効な場合はカスタムテキストを設定する',
            '設定 → ホットキー に移動する',
            '「Send configured custom text」を探す',
            '任意のホットキーを設定する（デフォルト: Shift+Enter）',
            'ターミナルでホットキーを押して設定に応じたテキストを送信する',
        ],
    },
}

@Component({
    template: `
        <h3>{{t.title}}</h3>
        <div class="form-group">
            <div class="form-check">
                <input
                    type="checkbox"
                    class="form-check-input"
                    id="includeBackslash"
                    [(ngModel)]="includeBackslash"
                    (change)="onToggleChange()"
                />
                <label class="form-check-label" for="includeBackslash">
                    {{t.toggleLabel}}
                </label>
            </div>
            <small class="form-text text-muted">{{t.toggleHint}}</small>
        </div>
        <div class="form-group">
            <label>{{t.customTextLabel}}</label>
            <div class="input-group">
                <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="customText"
                    (input)="onTextChange()"
                    [disabled]="!includeBackslash"
                    [placeholder]="t.customTextPlaceholder"
                />
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" (click)="resetToDefault()" [disabled]="!includeBackslash">
                        {{t.resetButton}}
                    </button>
                </div>
            </div>
            <small class="form-text text-muted">
                {{t.customTextHint}}
                <span class="text-success" *ngIf="saveStatus">{{t.savedMessage}}</span>
            </small>
        </div>
        <div class="form-group">
            <label>{{t.previewLabel}}</label>
            <code class="form-control-plaintext bg-light p-2 rounded">{{getPreviewText()}}</code>
        </div>
        <div class="form-group">
            <div class="alert alert-info">
                <strong><i class="fas fa-info-circle"></i> {{t.howToTitle}}</strong>
                <ol class="mb-0 mt-2">
                    <li *ngFor="let step of t.howToSteps">{{step}}</li>
                </ol>
            </div>
        </div>
    `,
})
export class BackslashNewlineSettingsTabComponent {
    customText: string = ' \\\n'
    includeBackslash: boolean = true
    saveStatus: boolean = false
    t = TRANSLATIONS['en']
    private readonly defaultText = ' \\\n'

    constructor(private config: ConfigService, private locale: LocaleService) {
        const lang = this.locale.getLocale().startsWith('ja') ? 'ja' : 'en'
        this.t = TRANSLATIONS[lang]
        this.customText = this.config.store?.backslashNewline?.customText || this.defaultText
        this.includeBackslash = this.config.store?.backslashNewline?.includeBackslash ?? true
    }

    onTextChange() {
        if (!this.config.store.backslashNewline) {
            (this.config.store as any).backslashNewline = {}
        }
        (this.config.store as any).backslashNewline.customText = this.customText
        this.config.save()
        this.showSaveStatus()
    }

    onToggleChange() {
        if (!this.config.store.backslashNewline) {
            (this.config.store as any).backslashNewline = {}
        }
        (this.config.store as any).backslashNewline.includeBackslash = this.includeBackslash
        this.config.save()
        this.showSaveStatus()
    }

    resetToDefault() {
        this.customText = this.defaultText
        this.onTextChange()
    }

    getPreviewText(): string {
        if (!this.includeBackslash) {
            return '⏎'
        }
        return this.customText
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '⏎')
            .replace(/\\t/g, '→')
            .replace(/ /g, '·')
    }

    private showSaveStatus() {
        this.saveStatus = true
        setTimeout(() => {
            this.saveStatus = false
        }, 2000)
    }
}
