"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const taleforgerPanel_1 = require("./taleforgerPanel");
function activate(context) {
    console.log('✅ Taleforger extension activated');
    // ==========================================
    // PANEL PROVIDER (پنل ابزارها)
    // ==========================================
    const panelProvider = vscode.window.registerWebviewViewProvider('taleforger.panel', {
        resolveWebviewView(webviewView) {
            webviewView.webview.options = { enableScripts: true };
            webviewView.webview.html = taleforgerPanel_1.TaleforgerPanel.getHtml();
            webviewView.webview.onDidReceiveMessage(msg => {
                switch (msg.command) {
                    case 'run':
                        vscode.commands.executeCommand('taleforger.run');
                        break;
                    case 'build':
                        vscode.commands.executeCommand('taleforger.build');
                        break;
                    case 'newFile':
                        vscode.commands.executeCommand('taleforger.newFile');
                        break;
                    case 'help':
                        vscode.commands.executeCommand('taleforger.help');
                        break;
                }
            });
        }
    });
    context.subscriptions.push(panelProvider);
    // ==========================================
    // COMMANDS (دستورات)
    // ==========================================
    context.subscriptions.push(vscode.commands.registerCommand('taleforger.run', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor?.document.fileName.endsWith('.tafo')) {
            editor.document.save();
            const terminal = vscode.window.createTerminal('Taleforger');
            terminal.show();
            terminal.sendText(`taleforger "${editor.document.fileName}"`);
        }
        else {
            vscode.window.showWarningMessage('لطفاً یک فایل .tafo باز کنید');
        }
    }), vscode.commands.registerCommand('taleforger.build', () => {
        vscode.window.showInformationMessage('🏗️ Build started...');
    }), vscode.commands.registerCommand('taleforger.newFile', async () => {
        const uri = await vscode.window.showSaveDialog({
            filters: { 'Taleforger': ['tafo'] }
        });
        if (uri) {
            const content = '/* Taleforger Script */\n\nprint("سلام دنیا!");\n';
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc);
        }
    }), vscode.commands.registerCommand('taleforger.help', () => {
        vscode.env.openExternal(vscode.Uri.parse('https://github.com/taleforger/docs'));
    }));
    // ==========================================
    // HOVER PROVIDER
    // ==========================================
    context.subscriptions.push(vscode.languages.registerHoverProvider('taleforger', {
        provideHover(document, position) {
            const word = document.getText(document.getWordRangeAtPosition(position));
            const data = {
                'int': '### Int32\nعدد صحیح ۳۲ بیتی\n\n**پیش‌فرض:** `0` | **حجم:** ۴ بایت',
                'float': '### Float32\nعدد اعشاری ۳۲ بیتی\n\n**پیش‌فرض:** `0.0` | **حجم:** ۴ بایت',
                'string': '### String\nرشته متنی\n\n**پیش‌فرض:** `""` | **حداکثر:** ۲۰۴۸ کاراکتر',
                'bool': '### Boolean\nدرست/نادرست\n\n**پیش‌فرض:** `false` | **حجم:** ۱ بایت',
                'sci_decimal': '### ScientificDecimal\nدقت ۴۴ رقم\n\n**حجم:** ۳۲ بایت',
                'list': '### List\nلیست پویا – پشتیبانی از `[]` و `+`',
                'dict': '### Dictionary\nدیکشنری کلید-مقدار – پشتیبانی از `[]`',
                'print': '### print(any)\nچاپ در کنسول – خروجی: void',
                'length': '### length(string)\nطول رشته – خروجی: int',
                'if': '### if\nشرط – سبک C: `if () {}` – سبک Python: `if : {}`',
                'for': '### for\nحلقه با گام هوشمند – `step` اختیاری',
                'while': '### while\nحلقه – سبک C و Python',
            };
            return data[word] ? new vscode.Hover(new vscode.MarkdownString(data[word])) : null;
        }
    }));
    // ==========================================
    // COMPLETION PROVIDER
    // ==========================================
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('taleforger', {
        provideCompletionItems() {
            const items = [];
            const add = (label, kind, detail) => {
                const item = new vscode.CompletionItem(label, kind);
                item.detail = detail;
                items.push(item);
            };
            // کنترل جریان
            ['if', 'else', 'while', 'for', 'break', 'continue', 'return'].forEach(k => add(k, vscode.CompletionItemKind.Keyword, 'کنترل جریان'));
            // انواع
            ['int', 'float', 'string', 'bool', 'sci_decimal', 'list', 'dict', 'void', 'any'].forEach(t => add(t, vscode.CompletionItemKind.TypeParameter, 'نوع داده'));
            // OOP
            ['class', 'func', 'var', 'this', 'step'].forEach(o => add(o, vscode.CompletionItemKind.Struct, 'شیءگرایی'));
            // توابع
            add('print', vscode.CompletionItemKind.Function, 'چاپ در کنسول');
            add('length', vscode.CompletionItemKind.Function, 'طول رشته');
            add('چاپ', vscode.CompletionItemKind.Function, 'معادل print');
            add('طول', vscode.CompletionItemKind.Function, 'معادل length');
            // ثابت‌ها
            ['true', 'false'].forEach(c => add(c, vscode.CompletionItemKind.Constant, 'ثابت'));
            return items;
        }
    }, ''));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map