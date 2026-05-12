# yomu-docs

Dokumentasi resmi Yomu — platform pembelajaran poliglot yang dibangun dengan Java, Rust, dan Next.js. Dokumentasi ini ditulis dalam Bahasa Indonesia dan menggunakan Fumadocs — framework dokumentasi modern berbasis Next.js.

## Tentang Proyek

Yomu adalah platform pembelajaran yang menggabungkan:

- **Java Backend** — Spring Boot 4.0.2 untuk autentikasi, manajemen pengguna, artikel, kuis, dan forum
- **Rust Backend** — Axum 0.8.8 untuk engine gamifikasi: clan, leaderboard, achievement, dan misi harian
- **Next.js Frontend** — Next.js 16.1.6 dengan React 19, Tailwind CSS v4, dan shadcn/ui

Sepenuhnya ditulis dalam Bahasa Indonesia untuk menjangkau komunitas pengembang lokal.

## Teknologi

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Framework Dokumentasi | Fumadocs + Next.js | 16.2.4 / 16.8.8 |
| React | React | 19.2.3 |
| Styling | Tailwind CSS | v4 |
| Komponen UI | shadcn/ui | new-york |
| Font | Geist | latest |
| Package Manager | bun | 1.x |

## Struktur Direktori

```
yomu-docs/
├── content/docs/           # Semua konten dokumentasi MDX
│   ├── index.mdx          # Halaman utama dokumentasi
│   ├── architecture/        # system architecture (4 halaman)
│   ├── backend-java/        # Dokumentasi Java backend (4 halaman)
│   ├── backend-rust/        # Dokumentasi Rust backend (5 halaman)
│   ├── frontend/            # Dokumentasi frontend (3 halaman)
│   ├── design-decisions/    # Keputusan Architecture & teknologi (3 halaman)
│   ├── design-architecture/ # Clean vs Layered Architecture (2 halaman)
│   ├── cicd/                # Pipeline CI/CD (4 halaman)
│   ├── development/          # Panduan setup & development (2 halaman)
│   └── glosarium/          # Glosarium istilah teknis (120+ istilah)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (home)/          # Landing page
│   │   ├── docs/            # Dokumentasi layout & pages
│   │   └── api/search/      # Route handler untuk pencarian
│   ├── components/           # Komponen custom
│   │   └── mdx.tsx         # Stubs MDX (Cards, Callout, Steps, Diagram)
│   ├── lib/                  # Utils & source adapter
│   │   ├── layout.shared.tsx # Shared layout options
│   │   └── source.ts         # Content source adapter
│   └── middleware.ts        # Next.js middleware
├── public/                   # Aset statis
├── next.config.ts           # Konfigurasi Next.js
├── source.config.ts         # Konfigurasi Fumadocs source
├── tailwind.config.ts       # Konfigurasi Tailwind v4
└── tsconfig.json            # Konfigurasi TypeScript
```

## Mulai Cepat

### Prasyarat

- **bun** — `curl -fsSL https://bun.sh/install | bash`
- **Node.js** 22+ (dibutuhkan oleh beberapa dependency build-time)

```bash
# Verifikasi bun
bun -v  # minimal bun 1.x
```

### Instalasi

```bash
# Clone dan masuk ke direktori
# cd /home/pongo/projects/kuliah/adpro/final_project/yomu-docs

# Instal semua dependency
bun install
```

### Development Server

```bash
# Jalankan development server
bun run dev
```

Buka http://localhost:3000/docs di browser untuk melihat dokumentasi.

### Build Produksi

```bash
# Build untuk produksi (static prerendering)
bun run build
```

Output build berada di `.next/`. Dokumentasi Yomu menggunakan **output mode standalone** untuk deployment Docker yang optimal.

### Type Check

```bash
# Verifikasi TypeScript tanpa build
bun run typecheck
```

### Lint

```bash
# Jalankan ESLint
cd ../yomu-frontend && bun run lint
```

## Panduan Kontribusi

### Menambah Dokumentasi Baru

1. Buat file `.mdx` baru di `content/docs/<folder>/nama-halaman.mdx`
2. Tambahkan frontmatter:

```yaml
---
title: Judul Halaman
description: Deskripsi singkat halaman ini
---
```

3. Jika membuat folder baru, tambahkan `meta.json` di dalam folder:

```json
{
  "title": "Judul Bagian",
  "pages": ["index", "sub-halaman"]
}
```

4. Tambahkan entry di `content/docs/meta.json` (sidebar root) jika perlu muncul di navigasi utama.

### Komponen MDX yang Tersedia

Dokumentasi mendukung komponen-komponen berikut:

- **`<Cards>` dan `<Card>`** — Kartu navigasi
- **`<Callout type="info|warning|error|success">`** — Pesan callout
- **`<Steps>` dan `<Step title="...">`** — Langkah-langkah berurutan
- **`<Diagram name="Nama Diagram">`** — Wrapper Mermaid diagram
- **Code blocks** — Syntax highlighted (rust, java, typescript, sql, bash, yaml, json, dll.)
- **Tables** — Tabel Markdown standar
- **Mermaid** — Diagram sequence, flowchart, ER diagram

### Main Diagrams

```mermaid
graph TD
    A[Frontend Next.js] --> B[Java Backend]
    B --> C[Rust Backend] --> D[PostgreSQL]
```

### Future Architecture
```mermaid
graph TB
    subgraph Frontend_Squad ["Tim Web Experience (Frontend Owner)"]
        UI["Next.js (Client & SSR)"]
        BFF["Next.js API Routes (BFF)"]
    end

    subgraph Core_Squad ["Tim Core & Content (Java Owner)"]
        Auth["Auth & User Context"]
        Content["Content & Forum Context"]
        CoreDB[("PostgreSQL (Core_DB)")]
    end

    subgraph Engagement_Squad ["Tim Engagement (Rust Owner)"]
        Gamification["Gamification Context"]
        League["League Context"]
        EngineDB[("PostgreSQL (Engine_DB)")]
        Redis[("Redis Cache")]
    end

    subgraph Platform_Squad ["Tim Platform & SRE (Infra Owner)"]
        Outbox["User Sync Context (Outbox)"]
        Monitor["Observability (Grafana, Sentry)"]
        EC2{{"AWS EC2 Deployment"}}
    end

    %% Relasi Alur Komunikasi
    UI -->|HTTP/JSON| BFF
    BFF -->|REST API| Auth
    BFF -->|REST API| Content
    BFF -->|REST API| Gamification
    
    Auth --> CoreDB
    Content --> CoreDB
    Gamification --> EngineDB
    Gamification --> Redis
    League --> EngineDB
    
    Auth -.->|Generate Event| Outbox
    Outbox -.->|Webhook Push| Gamification
    Gamification -.->|Sync Pull| Auth

    %% Updated Styling for Better Readability
    classDef frontend fill:#00bcd4,stroke:#00838f,stroke-width:2px,color:#fff;
    classDef core fill:#673ab7,stroke:#4527a0,stroke-width:2px,color:#fff;
    classDef engagement fill:#e91e63,stroke:#880e4f,stroke-width:2px,color:#fff;
    classDef platform fill:#ff9800,stroke:#e65100,stroke-width:2px,color:#fff;

    class UI,BFF frontend;
    class Auth,Content,CoreDB core;
    class Gamification,League,EngineDB,Redis engagement;
    class Outbox,Monitor,EC2 platform;
```

### Deployment Diagram

```mermaid
flowchart TB
  User["Web / Mobile Users"]
  Internet((Internet))
  Google["External Service<br/>Google OAuth2 API<br/>oauth2.googleapis.com/tokeninfo"]

  subgraph PROD["Production Deployment Environment"]
    direction TB

    subgraph EC2["Deployment Node: Single AWS EC2 Instance"]
      direction TB

      Docker["Docker Compose Runtime<br/>single host network"]
      Nginx["Reverse Proxy<br/>Nginx / Caddy<br/>Ports :80 / :443"]

      subgraph FRONT_CONT["Execution Environment: Container yomu-frontend"]
        direction TB
        Next["Artifact: Next.js 16 Standalone Server<br/>Node runtime<br/>Port :3000"]
        Pages["Artifact: App Router Pages<br/>React 19 + Tailwind + shadcn/ui"]
        BFF["Artifact: Next Route Handlers / BFF<br/>/api/v1/auth<br/>/api/v1/users<br/>/api/v1/forums"]
        Cookie[("HttpOnly Auth Cookie<br/>AUTH_COOKIE_NAME<br/>sameSite=lax")]
        Mock[("Local Mock Data<br/>articles / quizzes")]
      end

      subgraph JAVA_CONT["Execution Environment: Container yomu-java-core"]
        direction TB
        JavaApp["Artifact: Spring Boot REST API<br/>Auth, User, Article, Quiz, Forum, Admin<br/>JWT stateless + JPA repositories<br/>Port :8080"]
      end

      Scheduler["Execution Environment: Container yomu-java-outbox-scheduler<br/>OUTBOX_SCHEDULER_ENABLED=true<br/>retry every 5 minutes"]

      subgraph RUST_CONT["Execution Environment: Container yomu-engine"]
        direction TB
        RustApp["Artifact: Rust Axum + Tonic<br/>HTTP :8081<br/>gRPC :9090<br/>/health /metrics /swagger-ui<br/>runs SQLx migrations on startup"]
      end

      JavaDB[("Container: yomu-core-postgres<br/>PostgreSQL<br/>Database: yomu_db<br/>Internal port :5432")]
      RustDB[("Container: yomu-engine-postgres<br/>PostgreSQL<br/>Internal port :5432")]
      Redis[("Container: yomu-redis<br/>Redis Alpine<br/>Internal port :6379<br/>AOF enabled")]
      Env["Environment Variables / .env<br/>SERVER_PORT, CORS, DB URLs,<br/>JWT issuer/audience, Rust host/port"]
      Secret["Runtime Secrets<br/>DB credentials, JWT_SECRET,<br/>INTERNAL_API_KEY,<br/>GOOGLE_OAUTH_CLIENT_ID"]
      CorePgVol[("Volume: core_postgres_data")]
      EnginePgVol[("Volume: engine_postgres_data")]
      RedisVol[("Volume: redis_data")]
    end
  end

  subgraph OBS["Supporting Infrastructure: Monitoring and Logging"]
    direction LR
    Prom["Prometheus Scraper"]
    Tempo["OTLP Collector / Grafana Tempo"]
    Sentry["Sentry Errors / APM"]
  end

  subgraph CICD["Supporting Infrastructure: CI/CD"]
    direction LR
    GitHub["GitHub Repository"]
    Actions["GitHub Actions<br/>test, clippy, audit, sonar, docker build"]
    GHCR["GitHub Container Registry<br/>ghcr.io/.../yomu-backend-rust"]
  end

  %% User and Frontend
  User -->|"HTTPS / HTTP<br/>pages + static assets"| Internet
  Internet -->|":80 / :443"| Nginx
  Nginx -->|"proxy /"| Next
  Next --> Pages
  Pages -->|"same-origin fetch<br/>/api/v1/..."| BFF
  Pages <-->|"Google sign-in popup / token"| Google
  BFF -->|"set / clear cookie"| Cookie
  User -->|"sends cookie automatically"| BFF
  Pages -->|"read quiz / catalog data"| Mock

  %% Frontend to Java Core Backend
  BFF -->|"REST + JWT<br/>/api/v1/auth<br/>/api/v1/users<br/>/api/v1/articles<br/>/api/v1/quizzes<br/>/api/v1/forums"| JavaApp

  %% Java Core to Database and External Services
  JavaApp -->|"JDBC / HikariCP"| JavaDB
  Scheduler -->|"JDBC<br/>read failed_sync_events<br/>update retry status"| JavaDB
  JavaApp -->|"verify Google ID token"| Google

  %% Java Core to Rust Engine
  JavaApp -->|"gRPC + x-api-key<br/>UserSyncService<br/>QuizSyncService<br/>LeagueService"| RustApp
  Scheduler -->|"retry sync<br/>gRPC + x-api-key"| RustApp
  RustApp -->|"internal REST + x-api-key<br/>/api/internal/articles/{article_id}/exists"| JavaApp

  %% Optional direct frontend to Rust Engine from env
  BFF -.->|"RUST_ENGINE_URL exists<br/>optional / planned direct call"| RustApp

  %% Rust Engine Persistence and Observability
  JavaDB --- CorePgVol
  RustApp -->|"SQLx pool<br/>DATABASE_URL"| RustDB
  RustApp -->|"Redis connection<br/>REDIS_URL"| Redis
  RustDB --- EnginePgVol
  Redis --- RedisVol
  Prom -->|"GET /metrics"| RustApp
  RustApp -->|"OTLP traces"| Tempo
  RustApp -->|"errors / APM"| Sentry

  %% Config and Secret Injection
  Env -.->|"env"| Next
  Env -.->|"env"| JavaApp
  Env -.->|"env"| Scheduler
  Env -.->|"env"| RustApp
  Secret -.->|"env"| JavaApp
  Secret -.->|"env"| Scheduler
  Secret -.->|"env"| RustApp

  %% CI/CD
  GitHub --> Actions
  Actions -->|"build and push image"| GHCR
  GHCR -->|"pull images on EC2"| Docker
  Docker -.->|"starts / restarts"| Next
  Docker -.->|"starts / restarts"| JavaApp
  Docker -.->|"starts / restarts"| Scheduler
  Docker -.->|"starts / restarts"| RustApp

  %% Legend / Styling
  classDef user fill:#ffffff,stroke:#111827,stroke-width:2px,color:#111827;
  classDef external fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#111827;
  classDef host fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#111827;
  classDef frontend fill:#e8f1ff,stroke:#2563eb,stroke-width:2px,color:#111827;
  classDef java fill:#fff1e6,stroke:#f97316,stroke-width:2px,color:#111827;
  classDef rust fill:#ecfdf5,stroke:#16a34a,stroke-width:2px,color:#111827;
  classDef data fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px,color:#111827;
  classDef infra fill:#fef9c3,stroke:#ca8a04,stroke-width:2px,color:#111827;
  classDef support fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#111827;
  classDef optional fill:#f5f3ff,stroke:#7c3aed,stroke-dasharray:5 5,color:#111827;

  class User user;
  class Google external;
  class EC2,PROD host;
  class Next,Pages,BFF,FRONT_CONT frontend;
  class JavaApp,Scheduler,Env,Secret,JAVA_CONT java;
  class RustApp,RUST_CONT rust;
  class JavaDB,RustDB,Redis,CorePgVol,EnginePgVol,RedisVol,Cookie,Mock data;
  class Internet,Nginx,Docker infra;
  class Prom,Tempo,Sentry,GitHub,Actions,GHCR,OBS,CICD support;
```  
  
## Context Diagram  
```mermaid
  flowchart TD
  %% Definisi Aktor
  Pelajar(["Pelajar"])
  Admin(["Admin"])

  %% Definisi Sistem Eksternal
  GoogleSSO["Google OAuth\n(Layanan Eksternal)"]
  Observability["Sistem Observability\n(Sentry, Prometheus, Tempo)"]

  %% Definisi Batasan Sistem Yomu
  subgraph Yomu_System ["Sistem Yomu (Platform Pembelajaran Poliglot)"]
      FE["Yomu Frontend\n(Next.js App Router & BFF)"]
      
      %% Core Java
      JC["Java Core Service\n(Spring Boot 4)"]
      Scheduler["Java Outbox Scheduler\n(Retry Job)"]
      
      %% Engine Rust
      RE["Rust Gamification Engine\n(Axum & Tonic)"]

      %% Definisi Database
      JDB[("Core DB\n(PostgreSQL)")]
      RDB[("Engine DB\n(PostgreSQL)")]
      RC[("Redis Cache")]
  end

  %% Relasi Aktor
  Pelajar -- "Mengakses UI aplikasi\n(HTTPS)" --> FE
  Admin -- "Mengelola konten & sistem\n(HTTPS)" --> FE

  %% Relasi Frontend
  FE <-->|"Mendapatkan ID Token\n(Popup/Redirect)"| GoogleSSO
  FE -- "REST API (JWT)\n(Auth, User, Bacaan, Forum)" --> JC
  FE -. "REST API (Opsional/Planned)\n(Leaderboard, Clan, Misi)" .-> RE

  %% Relasi Java Core
  JC -- "Verifikasi ID Token Google" --> GoogleSSO
  JC -- "Simpan kredensial, bacaan & event" --> JDB
  JC -- "Sinkronisasi User, Quiz & Liga\n(gRPC + x-api-key)" --> RE
  
  %% Relasi Scheduler (Fault Tolerance)
  Scheduler -- "Membaca failed_sync_events" --> JDB
  Scheduler -- "Retry sinkronisasi gagal\n(gRPC + x-api-key)" --> RE

  %% Relasi Rust Engine
  RE -- "Verifikasi validitas artikel\n(Internal REST + x-api-key)" --> JC
  RE -- "Simpan data Clan, Tier & Histori" --> RDB
  RE -- "Cache data Leaderboard" --> RC

  %% Relasi Observability (Logging & APM)
  JC -. "Kirim Error & Trace" .-> Observability
  RE -. "Kirim Metrics, Error & Trace" .-> Observability

  %% Styling disesuaikan dengan Future Architecture Yomu Docs
  classDef actor fill:#f8f9fa,stroke:#343a40,stroke-width:2px,color:#000;
  classDef frontend fill:#00bcd4,stroke:#00838f,stroke-width:2px,color:#fff;
  classDef core fill:#673ab7,stroke:#4527a0,stroke-width:2px,color:#fff;
  classDef engagement fill:#e91e63,stroke:#880e4f,stroke-width:2px,color:#fff;
  classDef database fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000;
  classDef external fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000;
  classDef support fill:#ff9800,stroke:#e65100,stroke-width:2px,color:#fff;

  class Pelajar,Admin actor;
  class FE frontend;
  class JC,Scheduler core;
  class RE engagement;
  class JDB,RDB,RC database;
  class GoogleSSO external;
  class Observability support;  
```      

### Translate & Localization

Semua konten dokumentasi ditulis dalam Bahasa Indonesia. Istilah teknis (JWT, OAuth, REST, API, BFF, DTO, CRUD, CI/CD, Redis, PostgreSQL, Docker, Kubernetes, Java, Rust, Next.js, Spring Boot, Axum, SQLx, JPA, Hibernate, dll.) tetap dalam Bahasa Inggris. Hanya narasi, penjelasan, deskripsi, dan heading yang diterjemahkan.

## Deployment

D dokumentasi ini dideploy sebagai static site dengan Next.js standalone output. Build menghasilkan halaman HTML statis untuk semua route dokumentasi.

### Manual Deployment

```bash
bun run build
```

### Dokumentasi Terkait

- [Fumadocs Documentation](https://fumadocs.dev) — Pelajari lebih lanjut tentang Fumadocs features dan API.
- [Next.js Documentation](https://nextjs.org/docs) — Pelajari tentang Next.js features dan API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Referensi utility classes.
- [shadcn/ui Documentation](https://ui.shadcn.com) — Komponen UI yang digunakan.

### Keterbatasan yang Diketahui

Berdasarkan struktur proyek Yomu Docs:

- Tidak menggunakan package manager lain selain bun
- Tidak ada file `.next/` yang di-commit ke repository
- Selalu jalankan `bun run build` sebelum deployment untuk memverifikasi tidak ada error
- MDX parser sangat sensitif terhadap tag yang tidak seimbang — selalu verifikasi build lolos
- Proyek ini memiliki banyak file `.mdx` — pastikan semua component stubs (Cards, Callout, Steps, Diagram) tersedia di `src/components/mdx.tsx`

---

**Yomu Docs** — Dokumentasi Architecture dan developer guide untuk platform pembelajaran Yomu. Ditulis dengan Bahasa Indonesia dan dibangun dengan Fumadocs + Next.js.
