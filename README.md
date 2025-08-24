# 🏦 Friends Development Society (FDS) - হিসাব ব্যবস্থাপনা সিস্টেম

একটি সম্পূর্ণ বাংলা ভাষা সমর্থিত পিডিএফ অ্যাকাউন্ট স্টেটমেন্ট সিস্টেম, যা Friends Development Society (FDS) এর জন্য ডেভেলপ করা হয়েছে।

## ✨ মূল বৈশিষ্ট্য

### 🎯 কোর ফিচার
- **বাংলা পিডিএফ সিস্টেম**: সম্পূর্ণ বাংলা ভাষা সমর্থিত পিডিএফ জেনারেশন
- **সদস্য পোর্টাল**: ব্যক্তিগত হিসাব স্টেটমেন্ট ডাউনলোড
- **অ্যাডমিন প্যানেল**: যেকোনো সদস্যের জন্য অফিসিয়াল পিডিএফ জেনারেশন
- **মাসিক চাঁদা ব্যবস্থাপনা**: সহজেই মাসিক চাঁদা রেকর্ডিং এবং ট্র্যাকিং

### 🎨 ইউজার ইন্টারফেস
- **বাংলা ফার্স্ট**: সমস্ত কন্টেন্ট বাংলায় প্রাধান্য
- **রেসপন্সিভ ডিজাইন**: মোবাইল এবং ডেস্কটপ উভয়ের জন্য অপ্টিমাইজড
- **প্রফেশনাল লুক**: ক্লিন এবং মডার্ন ইন্টারফেস
- **Noto Sans Bengali ফন্ট**: পারফেক্ট বাংলা রেন্ডারিং

### 🔧 টেকনিক্যাল স্ট্যাক
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (Neon.tech)
- **Authentication**: JWT Token System
- **Deployment**: Vercel
- **PDF Generation**: Browser Print API

## 🚀 ডেপ্লয়মেন্ট গাইড

### পূর্বশর্ত
- Node.js 18+ ইনস্টল করা থাকতে হবে
- GitHub অ্যাকাউন্ট
- Vercel অ্যাকাউন্ট
- Neon.tech অ্যাকাউন্ট

### ধাপ ১: Neon.tech ডাটাবেস সেটআপ

1. **Neon.tech এ সাইন আপ করুন**
   ```bash
   # ভিজিট করুন: https://neon.tech/
   # GitHub দিয়ে সাইন আপ করুন
   ```

2. **নতুন প্রজেক্ট তৈরি করুন**
   - প্রজেক্টের নাম: `fds-database`
   - ডাটাবেস নাম: `fds`
   - রিজিওন: আপনার কাছাকাছি রিজিওন সিলেক্ট করুন

3. **কানেকশন স্ট্রিং কপি করুন**
   ```
   postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/fds?sslmode=require
   ```

### ধাপ ২: Vercel ডেপ্লয়মেন্ট

1. **Vercel এ সাইন আপ করুন**
   ```bash
   # ভিজিট করুন: https://vercel.com/
   # GitHub দিয়ে সাইন আপ করুন
   ```

2. **নতুন প্রজেক্ট ইমপোর্ট করুন**
   - "Import Git Repository" ক্লিক করুন
   - আপনার GitHub রিপোজিটরি সিলেক্ট করুন: `habib7042/fds2.0`

3. **Environment Variables সেট করুন**
   ```bash
   DATABASE_URL=postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/fds?sslmode=require
   NEXTAUTH_SECRET=your-random-secret-string
   NEXTAUTH_URL=https://your-app.vercel.app
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **ডেপ্লয় করুন**
   - "Deploy" বাটন ক্লিক করুন
   - Vercel অটোমেটিক্যালি বিল্ড এবং ডেপ্লয় করবে

### ধাপ ৩: ডাটাবেস মাইগ্রেশন

ডেপ্লয়মেন্টের পর, ডাটাবেস টেবিল তৈরি করতে হবে:

1. **Neon.tech ড্যাশবোর্ডে যান**
2. **SQL Editor** এ ক্লিক করুন
3. **নিচের SQL রান করুন**:

```sql
-- Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "username" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Member table
CREATE TABLE IF NOT EXISTS "Member" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "accountNumber" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contribution table
CREATE TABLE IF NOT EXISTS "Contribution" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "memberId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE,
    UNIQUE("memberId", "month", "year")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_contribution_member_id" ON "Contribution"("memberId");
CREATE INDEX IF NOT EXISTS "idx_contribution_month_year" ON "Contribution"("month", "year");
CREATE INDEX IF NOT EXISTS "idx_member_account_number" ON "Member"("accountNumber");

-- Insert default admin user (password: admin123)
INSERT INTO "Admin" ("id", "username", "password", "name") 
VALUES ('admin-id', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator')
ON CONFLICT ("username") DO NOTHING;
```

### ধাপ ৪: প্রাথমিক ডাটা সেটআপ

কিছু টেস্ট ডাটা যোগ করতে চাইলে:

```sql
-- Insert test members
INSERT INTO "Member" ("id", "accountNumber", "name", "phone", "email") 
VALUES 
    ('member-1', '0001', 'মোঃ আব্দুল করিম', '01712345678', 'karim@example.com'),
    ('member-2', '0002', 'মোঃ রহিম উদ্দিন', '01712345679', 'rahim@example.com'),
    ('member-3', '0003', 'মোঃ সালাউদ্দিন', '01712345680', 'salahuddin@example.com')
ON CONFLICT ("accountNumber") DO NOTHING;

-- Insert test contributions
INSERT INTO "Contribution" ("memberId", "month", "year", "amount", "description")
VALUES 
    ('member-1', '01', 2024, 500.00, 'জানুয়ারি মাসের চাঁদা'),
    ('member-1', '02', 2024, 500.00, 'ফেব্রুয়ারি মাসের চাঁদা'),
    ('member-2', '01', 2024, 500.00, 'জানুয়ারি মাসের চাঁদা'),
    ('member-3', '01', 2024, 500.00, 'জানুয়ারি মাসের চাঁদা')
ON CONFLICT ("memberId", "month", "year") DO NOTHING;
```

## 🎯 ব্যবহারের নির্দেশিকা

### অ্যাডমিন লগইন
- **URL**: `https://your-app.vercel.app`
- **Username**: `admin`
- **Password**: `admin123`

### সদস্য লগইন
- **URL**: `https://your-app.vercel.app`
- **Account Number**: 4-ডিজিট নম্বর (যেমন: `0001`)

### পিডিএফ ডাউনলোড
- **সদস্য পোর্টাল**: "হিসাব স্টেটমেন্ট প্রিন্ট করুন" বাটন
- **অ্যাডমিন প্যানেল**: প্রতিটি সদস্যের পাশে "PDF" বাটন

## 🔧 ডেভেলপমেন্ট

### লোকাল ডেভেলপমেন্ট সেটআপ

```bash
# Clone the repository
git clone https://github.com/habib7042/fds2.0.git
cd fds2.0

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your Neon.tech database URL
# Start development server
npm run dev
```

### উপলব্ধ স্ক্রিপ্ট

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run vercel-build # Vercel build
```

## 📊 সিস্টেম আর্কিটেকচার

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │   (Neon.tech)   │
│ • Member Portal │    │ • Authentication│    │ • Admin Table   │
│ • Admin Panel  │    │ • Data API      │    │ • Member Table  │
│ • PDF Generation│    │ • PDF API       │    │ • Contributions │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Vercel       │
                    │   (Platform)   │
                    │                 │
                    │ • Deployment    │
                    │ • Environment   │
                    │ • Scaling       │
                    └─────────────────┘
```

## 🔒 নিরাপত্তা বৈশিষ্ট্য

- **JWT Authentication**: সুরক্ষিত টোকেন ভিত্তিক অথেনটিকেশন
- **Environment Variables**: সেনসিটিভ ডাটা এনভায়রনমেন্ট ভেরিয়েবলে
- **PostgreSQL Security**: SSL সহ সুরক্ষিত ডাটাবেস কানেকশন
- **Input Validation**: Zod দিয়ে ইনপুট ভ্যালিডেশন

## 🌟 বিশেষ বৈশিষ্ট্য

### বাংলা ভাষা সমর্থন
- **Noto Sans Bengali ফন্ট**: পারফেক্ট বাংলা রেন্ডারিং
- **বাংলা নাম্বারিং**: বাংলা সংখ্যা সিস্টেম
- **বাংলা মাসের নাম**: জানুয়ারি, ফেব্রুয়ারি, ইত্যাদি
- **বাংলা তারিখ ফরম্যাট**: বাংলাদেশি তারিখ ফরম্যাট

### পিডিএফ জেনারেশন
- **Browser Print API**: নেটিভ ব্রাউজার ফাংশনালিটি
- **Professional Layout**: ক্লিন এবং প্রফেশনাল ডিজাইন
- **Complete Information**: সদস্য তথ্য, হিসাব সারাংশ, চাঁদার ইতিহাস
- **Special Notes**: অ-দাতা সদস্যদের জন্য বিশেষ নোটিশ

## 🤝 কন্ট্রিবিউশন

কন্ট্রিবিউশন করতে চাইলে:

1. রিপোজিটরি ফর্ক করুন
2. নতুন ব্রাঞ্চ তৈরি করুন (`git checkout -b feature/amazing-feature`)
3. আপনার পরিবর্তন কমিট করুন (`git commit -m 'Add some amazing feature'`)
4. পুশ করুন (`git push origin feature/amazing-feature`)
5. পুল রিকোয়েস্ট খুলুন

## 📄 লাইসেন্স

এই প্রজেক্টটি MIT লাইসেন্সের অধীনে লাইসেন্সকৃত - [LICENSE](LICENSE) ফাইল দেখুন।

## 🙏 কৃতজ্ঞতা

- **Neon.tech**: দুর্দান্ত PostgreSQL ডাটাবেস সার্ভিসের জন্য
- **Vercel**: দ্রুত এবং নির্ভরযোগ্য ডেপ্লয়মেন্ট প্ল্যাটফর্মের জন্য
- **Next.js**: দুর্দান্ত React ফ্রেমওয়ার্কের জন্য
- **Prisma**: টাইপ-সেফ ডাটাবেস ORM এর জন্য

---

**বিকাশকারী**: [আপনার নাম]  
**প্রজেক্ট মালিক**: Friends Development Society (FDS)  
**সর্বস্বত্ব সংরক্ষিত**: © 2024 FDS
