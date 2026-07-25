# Tale Forger Extension for VS Code

<p align="center">
  <b>[ <a href="#-persianfarsi">فارسی</a> ] | [ <a href="#-english">English</a> ] | [ <a href="#-russianрусский">Русский</a> ] | [ <a href="#-japanese日本語">日本語</a> ]</b>
</p>

---

## 🎨 Persian / فارسی

افزونهٔ **Tale Forger** محیطی کامل و قدرتمند برای توسعه با زبان برنامه‌نویسی نوع‌امن `.tafo` در Visual Studio Code فراهم می‌کند. این نسخه (MVP) با هدف ارائه یک تجربه کاربری بی‌نقص و بومی‌سازی‌شده توسعه یافته است.

> **توجه:** ۴ زبان پشتیبانی‌شده در این نسخه (فارسی، انگلیسی، روسی و ژاپنی) به عنوان نسخه آزمایشی (تستی) ارائه شده‌اند. 

### 💡 نمونه کد (`.tafo`)
```tafo
# تعریف متغیرها و انواع داده پایه
int age = 25;
string name = "امیر";
print("سلام " + name + "!");

# تعریف یک کلاس و متد
class Calculator {
    int factor;

    func multiply(int x) -> int {
        return this.factor * x;
    }
}

Calculator calc = Calculator();
calc.factor = 10;
print(calc.multiply(5));   # خروجی: 50