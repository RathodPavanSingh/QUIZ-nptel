# 📚 NPTEL Quiz Platform

A comprehensive multi-category quiz platform for academic and competitive exam preparation. Practice **10,000+ questions** across NPTEL courses, competitive programming, aptitude, government exams, MNC placement, JEE, and GATE.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue)

---

## ✨ Features

### 🎯 8 Major Course Categories

| Category | Description | Count |
| --- | --- | --- |
| **NPTEL** | University-level courses with year-wise and unit-wise practice | Multiple courses |
| **Programming** | Code-output MCQs in C, Java, Python | 50+ questions |
| **Coding** | DSA problems with multi-language solutions | 50+ problems |
| **Aptitude** | Numerical, Verbal, Reasoning | 30+ questions |
| **GATE EE** | 5 subjects, 50 Q each | 250 questions |
| **Entrance Exam** | JEE Main, Advanced, BITSAT, NEET, EAMCET, NDA | 1800+ questions |
| **Govt Exams** | UPSC, NDA, SSC CGL | 150 questions |
| **MNC Placement** | 11 companies with 90 MCQ + 10 coding each | 1100 questions |

### 🎨 Key Features

- **🔥 Smart Question Parser** - Upload questions via PDF, DOCX, JSON, CSV, Excel, or URL
- **🖼️ Image Support** - Add images to figure-based questions
- **📊 PYQ & Year Filters** - Filter questions by year (2020-2025) and Previous Year Questions
- **🔍 Real-time Search** - Instant search across all questions
- **📈 Performance Tracking** - Score tracking, explanations, and time tracking
- **🎯 Multi-format Questions** - MCQ, MSQ, Numerical, and Figure-based
- **🌓 Theme Support** - Light, Dark, and Auto modes
- **📱 Mobile Responsive** - Works seamlessly on all devices
- **🔐 Admin Panel** - Manage courses, questions, and content
- **🛠️ DevBox** - Universal question upload with auto-detection

---

## 🚀 Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **File Processing**:
  - PDF: `unpdf`
  - DOCX: `mammoth`
  - Excel: `xlsx`
- **Validation**: Server-side with TypeScript

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nptel-quiz
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env` file:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/nptel_quiz
   ```

4. **Setup database**

   ```bash
   npx drizzle-kit push
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**

<http://localhost:3000>

---

## 🏗️ Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

---
---

## 📚 Project Structure

```text
nptel-quiz/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home page
│   │   ├── admin/              # Admin panel
│   │   ├── programming/        # Programming MCQs
│   │   ├── coding/             # Coding problems
│   │   ├── aptitude/           # Aptitude questions
│   │   ├── gate/               # GATE subjects
│   │   ├── jee/                # Entrance exams
│   │   ├── govt/               # Government exams
│   │   ├── mnc/                # MNC placement
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   ├── components/             # React components
│   │   ├── TopHeader.tsx       # Header with menu
│   │   ├── Footer.tsx          # Footer
│   │   ├── AdminBar.tsx        # Admin bar
│   │   ├── PracticeNav.tsx     # Practice navigation
│   │   └── ...
│   ├── db/                     # Database
│   │   ├── schema.ts           # Drizzle schema
│   │   ├── seed.ts             # Seed function
│   │   ├── seed-data.ts        # NPTEL seed data
│   │   ├── seed-coding.ts      # Coding seed data
│   │   ├── seed-practice.ts    # Aptitude/GATE seed data
│   │   ├── seed-jee.ts         # JEE seed data
│   │   ├── seed-govt.ts        # Govt exams seed data
│   │   └── seed-mnc.ts         # MNC seed data
│   └── lib/                    # Utilities
│       ├── jee-meta.ts         # JEE metadata
│       ├── practice-meta.ts    # Practice metadata
│       └── ...
├── public/                     # Static assets
├── .env                        # Environment variables
├── drizzle.config.json         # Drizzle configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🎓 Course Categories

### 1. **NPTEL Courses**

- Cloud Computing
- Computer Networks
- Data Analytics with Python
- Affective Computing
- Machine Learning
- Database Management Systems
- Programming, Data Structures & Algorithms
- And more...

### 2. **Programming MCQs**

- C, C++, Java, Python
- Code output questions
- Output prediction
- Language-specific concepts

### 3. **Coding Problems**

- Data Structures & Algorithms
- Multi-language solutions (Python, Java, C++, C)
- Time & space complexity analysis
- Common mistakes and pro tips

### 4. **Aptitude**

- Numerical Ability
- Verbal Reasoning
- Logical Reasoning

### 5. **GATE EE (Electrical Engineering)**

- Electrical Machines (50 Q)
- Power Systems (50 Q)
- Power Electronics (50 Q)
- Network Theory (50 Q)
- Control Systems (50 Q)

### 6. **Entrance Exams**

- JEE Main
- JEE Advanced
- BITSAT
- NEET
- TS EAMCET
- AP EAMCET
- NDA

### 7. **Government Exams**

- UPSC Civil Service (50 Q)
- NDA (50 Q)
- SSC CGL Tier I (50 Q)

### 8. **MNC Placement**

- Google, Microsoft, TCS, L&T
- Infosys, Cognizant, Wipro
- Aditya Birla, Siemens, ICICI Bank, IBM
- Each: 90 MCQ + 10 Coding

---

## 🛠️ Admin Panel

Access at `/admin`:

### Features

- **Manage Courses** - Create, edit, delete courses
- **Manage Questions** - Add, edit, delete questions
- **Upload Files** - PDF, DOCX, JSON, CSV, Excel
- **View Statistics** - Question counts, user activity
- **Image Upload** - Add images to questions

### DevBox (Universal Upload)

Access at `/admin/devbox`:

### DevBox Features

- **Auto-detection** - Automatically detects MCQ, MSQ, Numerical, Figure questions
- **Format Support** - PDF, DOCX, JSON, CSV, Excel, URL
- **Live Preview** - Edit questions before saving
- **Bulk Upload** - Upload hundreds of questions at once
- **Smart Parser** - Extracts questions, options, answers, explanations

---

## 🎨 Design Features

### Modern UI

- Clean, professional design
- Smooth animations and transitions
- Glassmorphism effects
- Gradient backgrounds
- Custom animations (marquee, pulse, etc.)

### Color Themes

- Orange gradient header
- Dark mode support
- Brand colors per category
- High contrast for accessibility

---

## 📊 Database Schema

### Main Tables

- `courses` - NPTEL and other courses
- `questions` - NPTEL assignment questions
- `programming_questions` - Programming MCQs
- `coding_problems` - DSA problems
- `practice_questions` - Aptitude, GATE, Govt, MNC MCQs
- `jee_questions` - Entrance exam questions

### Key Features

- JSONB storage for options and solutions
- Indexed for fast queries
- Cascade deletes for data integrity

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx drizzle-kit push # Push schema changes
```

---

## 📝 API Routes

### Admin

- `POST /api/admin/courses` - Create course
- `DELETE /api/admin/courses/[id]` - Delete course
- `POST /api/admin/questions` - Add question(s)
- `DELETE /api/admin/questions/[id]` - Delete question
- `POST /api/admin/universal-upload` - Universal upload (DevBox)
- `POST /api/admin/upload` - PDF/DOCX upload
- `POST /api/admin/upload-image` - Image upload

### Public

- `GET /api/courses/[slug]/meta` - Get course metadata
- `GET /api/courses/[slug]/questions` - Get course questions
- `GET /api/health` - Health check

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- NPTEL for the question inspiration
- All contributors who help improve this platform
- The open-source community for amazing tools

---

## 📞 Contact

- **Email**: <support@nptelquiz.com>
- **Website**: [https://nptelquiz.com](https://nptelquiz.com)
- **Twitter**: [@nptelquiz](https://twitter.com/nptelquiz)
- **LinkedIn**: [NPTEL Quiz](https://linkedin.com/company/nptelquiz)

---

## 🙏 Show your support

Give a ⭐️ if this project helped you!

---

## Made with ❤️ for students everywhere
