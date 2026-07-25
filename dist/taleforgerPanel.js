"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaleforgerPanel = void 0;
class TaleforgerPanel {
    static getHtml(lang) {
        const langs = [
            { v: 'fa', t: '🇮🇷 فارسی' },
            { v: 'en', t: '🇬🇧 English' },
            { v: 'ru', t: '🇷🇺 Русский' },
            { v: 'ja', t: '🇯🇵 日本語' }
        ];
        const options = langs.map(l => `<option value="${l.v}" ${l.v === lang ? 'selected' : ''}>${l.t}</option>`).join('');
        return `<!DOCTYPE html>
<html>
<head>
<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: var(--vscode-font-family); padding: 20px; background: var(--vscode-editor-background); color: var(--vscode-foreground); }
    .logo { font-size: 24px; font-weight: 700; color: #7C5CFC; text-align: center; margin-bottom: 24px; }
    .btn { display: block; width: 100%; padding: 10px 0; margin: 8px 0; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; color: white; transition: 0.2s; }
    .btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .btn.run { background: linear-gradient(135deg,#00B894,#00CEC9); }
    .btn.build { background: linear-gradient(135deg,#6C5CE7,#A29BFE); }
    .btn.new { background: linear-gradient(135deg,#0984E3,#74B9FF); }
    .btn.help { background: linear-gradient(135deg,#636E72,#B2BEC3); }
    .lang-section { margin-top: 24px; display: flex; align-items: center; justify-content: space-between; }
    .lang-section label { font-size: 14px; font-weight: 500; }
    select { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--vscode-input-border); background: var(--vscode-input-background); color: var(--vscode-input-foreground); font-size: 14px; cursor: pointer; outline: none; }
    .ver { text-align: center; margin-top: 24px; font-size: 12px; color: var(--vscode-descriptionForeground); }
</style>
</head>
<body>
    <div class="logo">🚀 Taleforger</div>
    <button class="btn run" onclick="cmd('run')">▶ اجرا</button>
    <button class="btn build" onclick="cmd('build')">⚙️ ساخت</button>
    <button class="btn new" onclick="cmd('newFile')">📄 فایل جدید</button>
    <button class="btn help" onclick="cmd('help')">❓ راهنما</button>
    <div class="lang-section">
        <label>🌐 زبان</label>
        <select id="langSelect" onchange="changeLang(this.value)">${options}</select>
    </div>
    <div class="ver">v0.2.0</div>
    <script>
        const v = acquireVsCodeApi();
        function cmd(c) { v.postMessage({command:c}); }
        function changeLang(lang) { v.postMessage({command:'setLang', lang}); }
    </script>
</body>
</html>`;
    }
}
exports.TaleforgerPanel = TaleforgerPanel;
