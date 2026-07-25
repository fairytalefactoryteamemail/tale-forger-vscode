# Tale Forger Extension for VS Code

<p align="center">
  <b>[ <a href="/fairytalefactoryteamemail/tale-forger-vscode/blob/main/README.md#user-content-persian--فارسی">فارسی</a> ] | [ <a href="/fairytalefactoryteamemail/tale-forger-vscode/blob/main/README.md#user-content-english">English</a> ] | [ <a href="/fairytalefactoryteamemail/tale-forger-vscode/blob/main/README.md#user-content-russian--русский">Русский</a> ] | [ <a href="/fairytalefactoryteamemail/tale-forger-vscode/blob/main/README.md#user-content-japanese--日本語">日本語</a> ]</b>
</p>

## 🎨 Persian / فارسی

افزونهٔ Tale Forger محیطی کامل و قدرتمند برای توسعه با زبان برنامه‌نویسی نوع‌امن .tafo در Visual Studio Code فراهم می‌کند. این نسخه (MVP) با هدف ارائه یک تجربه کاربری بی‌نقص و بومی‌سازی‌شده توسعه یافته است.

توجه: ۴ زبان پشتیبانی‌شده در این نسخه (فارسی، انگلیسی، روسی و ژاپنی) به عنوان نسخه آزمایشی (تستی) ارائه شده‌اند.

💡 نمونه کد (.tafo)
Code snippet
# تعریف متغیرها و انواع داده پایه
int age = 25;
string name = "امیر";
print("سلام " + name + "!");

# تعریف یک کلاس و متد
```tafo
class Calculator {
    int factor;

    func multiply(int x) -> int {
        return this.factor * x;
    }
}

Calculator calc = Calculator();
calc.factor = 10;
print(calc.multiply(5));   # خروجی: 50
```


✨ ویژگی‌های کلیدی
رنگ‌آمیزی کامل کد (Syntax Highlighting): رنگ‌آمیزی دقیق کلیدواژه‌ها، انواع داده، رشته‌ها، کامنت‌های سبز (#6A9955)، توابع و کلاس‌ها.

هاور چندزبانه: با نگه‌داشتن موس روی هر کلمه کلیدی یا تابع، توضیح و نام‌های مستعار آن به زبان انتخابی نمایش داده می‌شود.

سینتکس چندزبانه پویا: با تغییر زبان در پنل، تمام کلمات کلیدی و توابع فایل .tafo فوراً به زبان جدید ترجمه می‌شوند (بدون نیاز به کامپایل مجدد).

اتوکامپلیت هوشمند (IntelliSense): لیست پیشنهادات هوشمند شامل کلیدواژه‌ها، انواع، توابع و ثابت‌ها بر اساس زبان جاری.

کدهای آماده (Snippets): درج سریع ساختارهای پرکاربرد مانند حلقه‌ها، شرط‌ها، توابع و کلاس‌ها با کلید Tab.

پنل ابزار اختصاصی (Slidar): نوار کناری شیک با دکمه‌های Run، Build، فایل جدید و راهنما به‌همراه منوی کشویی انتخاب زبان.

اجرای مستقیم: ذخیره و اجرای خودکار فایل .tafo در ترمینال VS Code با دستور taleforger.

⚙️ نحوه نصب
فایل .vsix افزونه را دانلود کنید.

در محیط VS Code از منوی Extensions، گزینه Install from VSIX... را انتخاب کنید.

فایل را انتخاب کرده و از کدنویسی با Tale Forger لذت ببرید!

## 🌐 English
The Tale Forger extension provides a complete and powerful development environment for the type-safe .tafo programming language in Visual Studio Code.

Note: The 4 supported languages (English, Persian, Russian, and Japanese) are currently provided as a test/preview release.

💡 Example (.tafo)
Code snippet
# Define variables and basic data types

```tafo
int age = 25;
string name = "Amir";
print("Hello " + name + "!");

# Define a class and a function
class Calculator {
    int factor;

    func multiply(int x) -> int {
        return this.factor * x;
    }
}

Calculator calc = Calculator();
calc.factor = 10;
print(calc.multiply(5));   # Output: 50

```
✨ Key Features
Syntax Highlighting: Full colorization for keywords, types, strings, green comments (#6A9955), functions, and classes.

Multilingual Hover: Hovering over any keyword or function displays its description and aliases in your chosen language.

Dynamic Multilingual Syntax: Change the language in the panel to instantly translate all keywords and functions in your .tafo file without recompiling.

Smart IntelliSense: Context-aware autocompletion for keywords, types, functions, and constants.

Code Snippets: Quickly insert common structures (loops, if/else, functions, classes, variables) using Tab.

Slidar Tool Panel: A sleek sidebar featuring Run, Build, New File, and Help buttons, plus a language selector dropdown.

Direct Execution: Save and run your current .tafo file directly in the VS Code terminal using the taleforger command.

⚙️ Installation
Download the extension .vsix file.

Open VS Code Extensions view, click on the three dots (...) at the top, and select Install from VSIX....

## 🇷🇺 Russian / Русский
Расширение Tale Forger предоставляет полную и мощную среду разработки для языка программирования со строгой типизацией .tafo в Visual Studio Code.

Примечание: 4 поддерживаемых языка (русский, английский, персидский и японский) в настоящее время являются тестовыми.

✨ Основные характеристики
Подсветка синтаксиса: Полная цветовая гамма для ключевых слов, типов, строк, зеленых комментариев (#6A9955), функций и классов.

Многоязычный Hover: Наведение курсора на ключевое слово или функцию отображает описание и псевдонимы на выбранном языке.

Динамический синтаксис: Изменение языка в панели мгновенно переводит все ключевые слова и функции в файле .tafo.

```tafo

# Объявление переменных и базовых типов данных
int age = 25;
string name = "Амир";
print("Привет, " + name + "!");

# Определение класса и функции
class Calculator {
    int factor;

    func multiply(int x) -> int {
        return this.factor * x;
    }
}

Calculator calc = Calculator();
calc.factor = 10;
print(calc.multiply(5));   # Результат: 50

```
Умный автозаполнение (IntelliSense): Интеллектуальные подсказки для ключевых слов, типов, функций и констант.

Сниппеты кода: Быстрый ввод конструкций (циклы, условия, функции, классы) с помощью клавиши Tab.

Панель инструментов (Slidar): Боковая панель с кнопками Run, Build, New File и выпадающим списком языков.

Прямой запуск: Сохранение и выполнение файла .tafo в терминале VS Code с помощью команды taleforger.

## 🇯🇵 Japanese / 日本語
Tale Forger 拡張機能は、Visual Studio Code で型安全なプログラミング言語 .tafo 用の完全で強力な開発環境を提供します。

注意: 現在サポートされている4つの言語（日本語、英語、ペルシャ語、ロシア語）はテスト版として提供されています。

✨ 主な機能
シンタックスハイライト: キーワード、型、文字列、緑色のコメント（#6A9955）、関数、クラスの完全な色分け。

多言語ホバー: キーワードや関数にマウスオーバーすると、選択した言語での説明とエイリアスが表示されます。

動的多言語構文: パネルで言語を変更すると、再コンパイルなしで .tafo ファイル内のキーワードや関数が即座に翻訳されます。


```tafo
# 変数と基本データ型の定義
int age = 25;
string name = "アミル";
print("こんにちは、" + name + "！");

# クラスと関数の定義
class Calculator {
    int factor;

    func multiply(int x) -> int {
        return this.factor * x;
    }
}

Calculator calc = Calculator();
calc.factor = 10;
print(calc.multiply(5));   # 出力: 50
```

スマートIntelliSense: 現在の言語に基づいたキーワード、型、関数、定数のスマート補完。

コードスニペット: Tab キーを使用して、ループ、条件分岐、関数、クラスなどの構造を素早く挿入できます。

Slidarツールパネル: 実行、ビルド、新規ファイル、ヘルプボタン、および言語選択ドロップダウンを備えたスタイリッシュなサイドバー。

直接実行: taleforger コマンドを使用して、VS Code ターミナルで .tafo ファイルを直接保存および実行します。

## 🌍 Adding New Languages & Contributing / افزودن زبان‌های جدید و مشارکت
The core engine currently has robust support for English, while other languages (like Russian and Japanese) are undergoing refinement.

توجه برای توسعه‌دهندگان: افزودن زبان‌های انسانی جدید یا رفع خطاهای ساختاری ریز (مثل کاراکترهای خاص در برخی زبان‌ها) در هستهٔ کامپایلر کاملاً امکان‌پذیر است، اما از آنجا که نیازمند توسعه‌ی عمیق‌تر در هسته و انجام تست‌های دقیق است، فرآیندی زمان‌بر محسوب می‌شود. در صورت نیاز به زبان‌های دیگر، از طریق گیت‌هاب درخواست خود را ثبت کنید!

## 📬 Contact & Links 
## 📺 YouTube: FaityTaleFactory

## 📱 Telegram: Unity_coder_1381
