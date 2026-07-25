import * as vscode from 'vscode';
import { TaleforgerPanel } from './taleforgerPanel';
import { getTemplates, applyTemplate } from './templateManager';

let currentLang: 'fa' | 'en' | 'ru' | 'ja' = 'fa';
let keywords: Record<string, Record<string, string>> = {};
let hoverTexts: Record<string, Record<string, string>> = {};

const categoryLabels: Record<string, Record<string, string>> = {
    fa: { 
        control: 'شرط و حلقه', 
        type: 'نوع داده', 
        oop: 'شیءگرایی', 
        constant: 'ثابت', 
        builtin: 'توابع آماده' 
    },
    en: { 
        control: 'Condition & Loop', 
        type: 'Data Type', 
        oop: 'Object‑Oriented', 
        constant: 'Constant', 
        builtin: 'Built‑in' 
    },
    ru: { 
        control: 'Условия и циклы', 
        type: 'Тип данных', 
        oop: 'ООП', 
        constant: 'Константа', 
        builtin: 'Встроенные' 
    },
    ja: { 
        control: '条件とループ', 
        type: 'データ型', 
        oop: 'オブジェクト指向', 
        constant: '定数', 
        builtin: '組み込み関数' 
    }
};

export async function activate(context: vscode.ExtensionContext) {
    // ۱. بارگذاری ترجمه‌ها
    const translationsUri = vscode.Uri.joinPath(context.extensionUri, 'translations.json');
    const raw = (await vscode.workspace.fs.readFile(translationsUri)).toString();
    const data = JSON.parse(raw);
    keywords = data.keywords || {};
    hoverTexts = data.hover || {};

    // ۲. بارگذاری زبان ذخیره‌شده
    currentLang = context.globalState.get('taleforger.lang', 'fa');

    // ۳. ترجمه فایل فعال در ابتدا
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.fileName.endsWith('.tafo')) {
        await translateActiveEditor(activeEditor, currentLang);
    }

    // ۴. پنل (تک‌زبانه)
    const panelProvider = vscode.window.registerWebviewViewProvider('taleforger.panel', {
        resolveWebviewView(webviewView) {
            webviewView.webview.options = { enableScripts: true };
            const updatePanel = () => {
                webviewView.webview.html = TaleforgerPanel.getHtml(currentLang);
            };
            updatePanel();

            webviewView.webview.onDidReceiveMessage(async (msg: any) => {
                switch (msg.command) {
                    case 'run': vscode.commands.executeCommand('taleforger.run'); break;
                    case 'build': vscode.commands.executeCommand('taleforger.build'); break;
                    case 'newFile': vscode.commands.executeCommand('taleforger.newFile'); break;
                    case 'help': vscode.commands.executeCommand('taleforger.help'); break;
                    case 'setLang':
                        currentLang = msg.lang;
                        await context.globalState.update('taleforger.lang', currentLang);
                        updatePanel();
                        // ترجمه فایل فعال (اگر وجود دارد)
                        const ed = vscode.window.activeTextEditor;
                        if (ed && ed.document.fileName.endsWith('.tafo')) {
                            await translateActiveEditor(ed, currentLang);
                        }
                        break;
                }
            });
        }
    });
    context.subscriptions.push(panelProvider);

    // ۵. ترجمه هنگام باز شدن فایل جدید
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async editor => {
            if (editor && editor.document.fileName.endsWith('.tafo')) {
                await translateActiveEditor(editor, currentLang);
            }
        })
    );

    // ۶. Hover (جستجوی ریشه برای کلمات ترجمه‌شده)
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('taleforger', {
            provideHover(document, position) {
                const word = document.getText(document.getWordRangeAtPosition(position));
                if (!word) return null;
                let rootWord = word;
                for (const [key, langMap] of Object.entries(keywords)) {
                    for (const lang of Object.values(langMap)) {
                        if (lang === word) { rootWord = key; break; }
                    }
                    if (rootWord !== word) break;
                }
                const desc = hoverTexts[currentLang]?.[rootWord];
                if (!desc) return null;
                const aliases = keywords[rootWord];
                let aliasLine = '';
                if (aliases) {
                    const all = Object.values(aliases).join(' / ');
                    aliasLine = `\n\n🌐 **نام‌های دیگر:** ${all}`;
                }
                return new vscode.Hover(new vscode.MarkdownString(desc + aliasLine));
            }
        })
    );

  // ۷. Completion (فقط انگلیسی – snippetها ترجمه‌ها را پوشش می‌دهند)
context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('taleforger', {
        provideCompletionItems() {
            const items: vscode.CompletionItem[] = [];
            const add = (label: string, kind: vscode.CompletionItemKind, detail: string) => {
                const item = new vscode.CompletionItem(label, kind);
                item.detail = detail;
                items.push(item);
            };
            const cat = categoryLabels[currentLang] ?? categoryLabels['en'];

            // فقط کلمات انگلیسی (بدون ترجمه)
            ['if','else','while','for','break','continue','return'].forEach(k => {
                add(k, vscode.CompletionItemKind.Keyword, cat.control);
            });
            ['int','float','string','bool','sci_decimal','list','dict','void','any'].forEach(t => {
                add(t, vscode.CompletionItemKind.TypeParameter, cat.type);
            });
            ['class','func','var','this','step'].forEach(o => {
                add(o, vscode.CompletionItemKind.Struct, cat.oop);
            });
            add('print', vscode.CompletionItemKind.Function, cat.builtin);
            add('length', vscode.CompletionItemKind.Function, cat.builtin);
            ['true','false'].forEach(c => add(c, vscode.CompletionItemKind.Constant, cat.constant));

            return items;
        }
    }, '')
);

    // ۸. Status bar
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.command = 'taleforger.showPanel';
   statusBar.text = currentLang === 'fa' ? '🇮🇷 فارسی' :
                 currentLang === 'ru' ? '🇷🇺 Русский' :
                 currentLang === 'ja' ? '🇯🇵 日本語' : '🇬🇧 English';
    statusBar.show();
    context.subscriptions.push(statusBar);

    // ۹. رنگ سبز کامنت‌ها
    const editorConfig = vscode.workspace.getConfiguration('editor');
    const tokenColors = editorConfig.get<any>('tokenColorCustomizations') || {};
    if (!tokenColors.textMateRules) tokenColors.textMateRules = [];
    if (!tokenColors.textMateRules.some((r: any) => r.scope && (r.scope.includes('comment.line.double-slash') || r.scope.includes('comment.block')))) {
        tokenColors.textMateRules.push({ scope: ['comment.line.double-slash', 'comment.block'], settings: { foreground: '#6A9955' } });
        editorConfig.update('tokenColorCustomizations', tokenColors, vscode.ConfigurationTarget.Global);
    }

    // ۱۰. غیرفعال‌سازی Word‑Based Suggestions
    const langConfig = vscode.workspace.getConfiguration('editor', { languageId: 'taleforger' });
    langConfig.update('wordBasedSuggestions', 'off', vscode.ConfigurationTarget.Global);

    // ۱۱. دستورات (Run, Build, NewFile, Help) – همان نسخه‌های قبلی که کار می‌کردند
    context.subscriptions.push(
        vscode.commands.registerCommand('taleforger.run', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor?.document.fileName.endsWith('.tafo')) {
                editor.document.save();
                const terminal = vscode.window.createTerminal('Taleforger');
                terminal.show();
                terminal.sendText(`taleforger "${editor.document.fileName}"`);
            } else {
                vscode.window.showWarningMessage(
                    currentLang === 'fa' ? 'لطفاً یک فایل .tafo باز کنید' :
                    currentLang === 'ru' ? 'Пожалуйста, откройте файл .tafo' :
                    'Please open a .tafo file'
                );
            }
        }),
        vscode.commands.registerCommand('taleforger.build', () => {
            vscode.window.showInformationMessage('🏗️ Build started...');
        }),
        vscode.commands.registerCommand('taleforger.newFile', async () => {
            const uri = await vscode.window.showSaveDialog({ filters: { 'Taleforger': ['tafo'] } });
            if (uri) {
                await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode('/* Taleforger Script */\n\nprint("سلام دنیا!");\n'));
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc);
            }
        }),
        vscode.commands.registerCommand('taleforger.help', () => {
            vscode.env.openExternal(vscode.Uri.parse('https://github.com/taleforger/docs'));
        })
    );



    context.subscriptions.push(
    vscode.commands.registerCommand('taleforger.newFromTemplate', async () => {
        const templates = getTemplates();
        const items = templates.map(t => ({
            label: t.name,
            description: t.description,
            template: t
        }));

        const selection = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a template to create'
        });
        if (!selection) return;

        await applyTemplate(selection.template, context);
    })
);
}
async function translateActiveEditor(editor: vscode.TextEditor, targetLang: string) {
    const doc = editor.document;
    const fullText = doc.getText();
    let newText = fullText;

    for (const [key, langMap] of Object.entries(keywords)) {
        const targetWord = langMap[targetLang] ?? key;
        const aliasesToReplace = Object.values(langMap).filter(a => a !== targetWord);
        if (aliasesToReplace.length === 0) continue;

        // Escape special regex characters in the words
        const escaped = aliasesToReplace.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        // Build a Unicode-safe word boundary pattern
        const pattern = new RegExp(`(?<=^|[^\\p{L}])(${escaped.join('|')})(?=[^\\p{L}]|$)`, 'gu');
        newText = newText.replace(pattern, targetWord);
    }

    if (newText !== fullText) {
        const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(fullText.length));
        try {
            await editor.edit(editBuilder => editBuilder.replace(fullRange, newText));
        } catch (err) {
            console.error('Taleforger translation error:', err);
        }
    }
}
export function deactivate() {}