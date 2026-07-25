"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaleforgerPanel = void 0;
class TaleforgerPanel {
    static getHtml() {
        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: var(--vscode-font-family); padding: 16px; color: var(--vscode-foreground); }
        .btn { width:100%; padding:10px; margin:6px 0; border:none; border-radius:6px; font-size:13px; cursor:pointer; color:white; }
        .run { background:#00b894; } .build { background:#6C5CE7; } .new { background:#0984e3; } .help { background:#636e72; }
        .ver { text-align:center; margin-top:16px; font-size:11px; opacity:0.7; }
    </style>
</head>
<body>
    <h2 style="text-align:center;color:#6C5CE7;">🚀 Taleforger</h2>
    <button class="btn run" onclick="post('run')">▶ اجرا</button>
    <button class="btn build" onclick="post('build')">⚙️ ساخت</button>
    <button class="btn new" onclick="post('newFile')">📄 فایل جدید</button>
    <button class="btn help" onclick="post('help')">❓ راهنما</button>
    <div class="ver">v0.4.2</div>
    <script>
        const v = acquireVsCodeApi();
        function post(cmd) { v.postMessage({command:cmd}); }
    </script>
</body>
</html>`;
    }
}
exports.TaleforgerPanel = TaleforgerPanel;
//# sourceMappingURL=taleforgerPanel.js.map