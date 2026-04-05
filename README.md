# tabby-nv-shift-enter

A [Tabby](https://tabby.sh) plugin that customizes the behavior when a hotkey (default: `Shift+Enter`) is pressed in the terminal.

**[日本語版はこちら](README.ja.md)**

## Features

- **Backslash + newline mode** — sends ` \` followed by a newline, enabling line continuation in shells (bash, zsh, etc.)
- **Newline-only mode** — sends only a newline character
- **Custom text** — fully configurable text to send, with escape sequence support (`\n`, `\t`, `\\`)
- **Live preview** — visual preview of the configured text in the settings panel
- **Multilingual UI** — settings panel supports English and Japanese (follows Tabby's language setting)

## Installation

Install via Tabby's plugin manager:

1. Open Tabby → **Settings** → **Plugins**
2. Search for `tabby-nv-shift-enter`
3. Click **Install**

Or install manually:

> **Note:** Manual installation requires the package to be available on npm. If the command returns "Not found", use the plugin manager instead.

```bash
# macOS
cd ~/Library/Application\ Support/tabby/plugins
npm install tabby-nv-shift-enter
```

```cmd
:: Windows (Command Prompt)
cd %APPDATA%\tabby
npm install tabby-nv-shift-enter
```

```powershell
# Windows (PowerShell)
cd "$env:APPDATA\tabby"
npm install tabby-nv-shift-enter
```

## Usage

1. Open **Settings** → **NV Shift Enter** to configure behavior
2. Toggle **Include backslash before newline** on or off
3. If enabled, customize the text to send (default: ` \` + newline)
4. Open **Settings** → **Hotkeys**, find **"Send configured custom text"**, and assign your preferred key (default: `Shift+Enter`)
5. Press the hotkey in any terminal tab to send the configured text

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| Include backslash | `true` | Send custom text (with backslash) instead of a plain newline |
| Custom text | ` \\\n` | Text sent when the hotkey is pressed. Supports `\n`, `\t`, `\\` |

### Custom text examples by shell

| Shell | Custom text | Notes |
|-------|------------|-------|
| bash / zsh | ` \\\n` | Default — backslash + newline |
| PowerShell | `` ` \n `` | Backtick for line continuation |
| CMD | ` ^\n` | Caret for line continuation |
| WSL / Git Bash on Windows | ` \\\n` | Same as bash/zsh |

## Requirements

- Tabby v1.0.197-nightly.1 or later

## License

ISC
