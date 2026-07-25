import * as vscode from 'vscode';

interface Template {
    name: string;
    description: string;
    type: 'file' | 'folder';
    path: string; // مسیر نسبی در پوشه‌ی templates
}

/**
 * لیست همه قالب‌های موجود. می‌تونی اینو از یه فایل JSON هم بخونی.
 */
export function getTemplates(): Template[] {
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
async function copyFile(templateUri: vscode.Uri, destinationUri: vscode.Uri) {
    const content = await vscode.workspace.fs.readFile(templateUri);
    await vscode.workspace.fs.writeFile(destinationUri, content);
}

/**
 * کپی بازگشتی یک پوشه
 */
async function copyFolder(templateFolderUri: vscode.Uri, destinationFolderUri: vscode.Uri) {
    const entries = await vscode.workspace.fs.readDirectory(templateFolderUri);
    for (const [name, type] of entries) {
        const srcUri = vscode.Uri.joinPath(templateFolderUri, name);
        const destUri = vscode.Uri.joinPath(destinationFolderUri, name);
        if (type === vscode.FileType.File) {
            await copyFile(srcUri, destUri);
        } else if (type === vscode.FileType.Directory) {
            await vscode.workspace.fs.createDirectory(destUri);
            await copyFolder(srcUri, destUri);
        }
    }
}

/**
 * اجرای قالب انتخاب‌شده
 */
export async function applyTemplate(template: Template, context: vscode.ExtensionContext) {
    const templatesRoot = vscode.Uri.joinPath(context.extensionUri, 'templates');
    const srcUri = vscode.Uri.joinPath(templatesRoot, template.path);

    if (template.type === 'file') {
        // دریافت مسیر ذخیره‌سازی از کاربر
        const uri = await vscode.window.showSaveDialog({
            filters: { 'Taleforger': ['tafo'] },
            defaultUri: vscode.Uri.file(template.name + '.tafo')
        });
        if (!uri) return; // کاربر کنسل کرد

        await copyFile(srcUri, uri);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
    } else {
        // برای پروژه‌های چندفایلی – انتخاب پوشه‌ی مقصد
        const folderUris = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: 'Select destination folder'
        });
        if (!folderUris || folderUris.length === 0) return;

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
        } catch {
            // main.tafo وجود نداره – پوشه رو در اکسپلورر VS Code باز کن
            vscode.commands.executeCommand('revealFileInOS', projectFolder);
        }
    }
}