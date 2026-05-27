# Authorization System with Passport.js

یک سیستم احراز هویت (Authentication) ساده با **Node.js**، **Express**، **Passport.js** و **MongoDB** که شامل ثبت‌نام، ورود، خروج و صفحه پروفایل محافظت‌شده است.

---

## ویژگی‌ها

- ثبت‌نام کاربر با `fullname`، `username` و `password`
- هش کردن رمز عبور با **bcrypt**
- ورود با **Passport Local Strategy**
- مدیریت session با **express-session**
- نمایش پیام خطا با **express-flash**
- محافظت از routeهای خصوصی با middleware
- رندر صفحات با **EJS** و layout مشترک
- ذخیره‌سازی کاربران در **MongoDB** با **Mongoose**

---

## تکنولوژی‌ها

| ابزار | کاربرد |
|--------|--------|
| [Express](https://expressjs.com/) | فریم‌ورک وب |
| [Passport.js](https://www.passportjs.org/) | احراز هویت |
| [passport-local](https://www.passportjs.org/packages/passport-local/) | استراتژی ورود با username/password |
| [Mongoose](https://mongoosejs.com/) | ODM برای MongoDB |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | هش رمز عبور |
| [EJS](https://ejs.co/) | موتور قالب |
| [express-ejs-layouts](https://www.npmjs.com/package/express-ejs-layouts) | Layout مشترک برای viewها |
| [express-session](https://www.npmjs.com/package/express-session) | مدیریت session |
| [express-flash](https://www.npmjs.com/package/express-flash) | پیام‌های flash |

---

## ساختار پروژه

```
6-Authorization-System-Passport/
├── app.js                  # نقطه ورود برنامه
├── passport.config.js      # تنظیمات Passport (Local Strategy)
├── package.json
├── middleware/
│   └── check-auth.js       # middlewareهای احراز هویت
├── model/
│   └── user.model.js       # Schema و Model کاربر
├── routes/
│   └── index.js            # تعریف routeها
├── utils/
│   └── error-handling.js   # مدیریت خطای 404 و 500
└── views/
    ├── layout/
    │   └── main.ejs        # Layout اصلی
    ├── index.ejs           # صفحه اصلی
    ├── login.ejs           # صفحه ورود
    ├── register.ejs        # صفحه ثبت‌نام
    └── profile.ejs         # صفحه پروفایل
```

---

## پیش‌نیازها

قبل از اجرای پروژه، موارد زیر باید نصب باشند:

- [Node.js](https://nodejs.org/) (نسخه 18 یا بالاتر پیشنهاد می‌شود)
- [MongoDB](https://www.mongodb.com/) (در حال اجرا روی `localhost:27017`)
- npm (همراه Node.js)

---

## نصب و راه‌اندازی

### 1. کلون یا دانلود پروژه

```bash
git clone <repository-url>
cd 6-Authorization-System-Passport
```

### 2. نصب وابستگی‌ها

```bash
npm install
```

### 3. اجرای MongoDB

مطمئن شوید MongoDB در حال اجراست. به‌صورت پیش‌فرض برنامه به این آدرس متصل می‌شود:

```
mongodb://localhost:27017/passport-js
```

### 4. اجرای سرور

**حالت توسعه (با nodemon):**

```bash
npm run dev
```

**حالت عادی:**

```bash
npm start
```

سرور روی پورت **3000** اجرا می‌شود:

```
http://localhost:3000
```

---

## مسیرها (Routes)

| Method | مسیر | دسترسی | توضیح |
|--------|------|--------|-------|
| `GET` | `/` | عمومی | صفحه اصلی |
| `GET` | `/register` | مهمان | فرم ثبت‌نام |
| `POST` | `/register` | مهمان | ایجاد کاربر جدید |
| `GET` | `/login` | مهمان | فرم ورود |
| `POST` | `/login` | مهمان | ورود کاربر |
| `GET` | `/profile` | احراز هویت‌شده | نمایش اطلاعات کاربر |
| `GET` | `/logout` | احراز هویت‌شده | خروج از حساب |

---

## جریان احراز هویت

### ثبت‌نام

1. کاربر فرم `/register` را پر می‌کند.
2. رمز عبور با bcrypt هش می‌شود.
3. اگر `username` تکراری باشد، پیام خطا نمایش داده می‌شود.
4. در صورت موفقیت، کاربر به `/login` هدایت می‌شود.

### ورود

1. کاربر در `/login` username و password را وارد می‌کند.
2. Passport با **Local Strategy** اعتبارسنجی می‌کند.
3. در صورت موفقیت → redirect به `/profile`
4. در صورت خطا → redirect به `/login` با پیام flash

### Session

- پس از ورود موفق، `user.id` در session ذخیره می‌شود.
- در هر درخواست بعدی، کاربر از MongoDB deserialize می‌شود و در `req.user` قرار می‌گیرد.

---

## مدل کاربر

```js
{
  fullName: String,   // نام کامل (required)
  username: String,   // نام کاربری یکتا (required, unique)
  password: String,   // رمز هش‌شده (required)
  createdAt: Date,    // خودکار (timestamps)
  updatedAt: Date     // خودکار (timestamps)
}
```

Collection در MongoDB: `users`

---

## Middlewareها

### `checkAuth`

اگر کاربر لاگین نکرده باشد، به `/login` redirect می‌شود.  
برای routeهای محافظت‌شده مثل `/profile` و `/logout` استفاده می‌شود.

### `redirectIfIsAuth`

اگر کاربر قبلاً لاگین کرده باشد، به `/profile` redirect می‌شود.  
برای routeهای `/login` و `/register` استفاده می‌شود تا کاربر لاگین‌شده دوباره وارد نشود.

---

## مدیریت خطا

| وضعیت | پاسخ |
|--------|------|
| `404` | `{ statusCode: 404, message: "NotFound Page" }` |
| `500` | `{ statusCode: 500, message: "..." }` |

---

## متغیرهای محیطی

| متغیر | پیش‌فرض | توضیح |
|--------|---------|-------|
| `PORT` | `3000` | پورت سرور |

---

## نکات

- رمز عبور هرگز به‌صورت plain text ذخیره نمی‌شود.
- در صفحه پروفایل فقط ۱۰ کاراکتر اول hash رمز نمایش داده می‌شود.
- برای production، مقدار `secret` در session را تغییر دهید و از فایل `.env` استفاده کنید.
