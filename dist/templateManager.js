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
exports.getTemplates = getTemplates;
exports.applyTemplate = applyTemplate;
const vscode = __importStar(require("vscode"));
/**
 * لیست همه قالب‌های موجود. می‌تونی اینو از یه فایل JSON هم بخونی.
 */
function getTemplates() {
    return [
        {
            name: 'Hello World',
            description: 'A simple hello world script',
            type: 'file',
            path: 'hello.tafo'
        },
        {
            name: 'Calculator',
            description: 'A basic calculator example',
            type: 'file',
            path: 'calculator.tafo'
        },
    ];
}
/**
 * کپی یک فایل از template به مسیر مقصد (destinationUri)
 */
async function copyFile(templateUri, destinationUri) {
    const content = await vscode.workspace.fs.readFile(templateUri);
    await vscode.workspace.fs.writeFile(destinationUri, content);
}
/**
 * کپی بازگشتی یک پوشه
 */
async function copyFolder(templateFolderUri, destinationFolderUri) {
    const entries = await vscode.workspace.fs.readDirectory(templateFolderUri);
    for (const [name, type] of entries) {
        const srcUri = vscode.Uri.joinPath(templateFolderUri, name);
        const destUri = vscode.Uri.joinPath(destinationFolderUri, name);
        if (type === vscode.FileType.File) {
            await copyFile(srcUri, destUri);
        }
        else if (type === vscode.FileType.Directory) {
            await vscode.workspace.fs.createDirectory(destUri);
            await copyFolder(srcUri, destUri);
        }
    }
}
/**
 * اجرای قالب انتخاب‌شده
 */
async function applyTemplate(template, context) {
    const templatesRoot = vscode.Uri.joinPath(context.extensionUri, 'templates');
    const srcUri = vscode.Uri.joinPath(templatesRoot, template.path);
    if (template.type === 'file') {
        // دریافت مسیر ذخیره‌سازی از کاربر
        const uri = await vscode.window.showSaveDialog({
            filters: { 'Taleforger': ['tafo'] },
            defaultUri: vscode.Uri.file(template.name + '.tafo')
        });
        if (!uri)
            return; // کاربر کنسل کرد
        await copyFile(srcUri, uri);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
    }
    else {
        // برای پروژه‌های چندفایلی – انتخاب پوشه‌ی مقصد
        const folderUris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: 'Select destination folder'
        });
        if (!folderUris || folderUris.length === 0)
            return;
        const destFolder = folderUris[0];
        const projectFolder = vscode.Uri.joinPath(destFolder, template.name);
        await vscode.workspace.fs.createDirectory(projectFolder);
        await copyFolder(srcUri, projectFolder);
        // باز کردن فایل اصلی (اختیاری – می‌تونی main.tafo رو باز کنی)
        const mainFile = vscode.Uri.joinPath(projectFolder, 'main.tafo');
        try {
            await vscode.workspace.fs.stat(mainFile);
            const doc = await vscode.workspace.openTextDocument(mainFile);
            await vscode.window.showTextDocument(doc);
        }
        catch {
            // main.tafo وجود نداره – پوشه رو در اکسپلورر VS Code باز کن
            vscode.commands.executeCommand('revealFileInOS', projectFolder);
        }
    }
}
