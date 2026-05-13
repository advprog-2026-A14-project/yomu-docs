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

#### C4 Container Diagram

![C4 Container Diagram - Yomu Polyglot Learning Platform](./content/docs/architecture/container-diagram.png)

Diagram kontainer di atas menggambarkan arsitektur Level 2 C4 Model untuk platform Yomu. Diagram ini menunjukkan:

- **Web Application** (Next.js 16) — Frontend BFF yang berkomunikasi dengan Java dan Rust backend
- **Java Core Service** (Spring Boot 4) — Autentikasi, artikel & kuis, forum, outbox sync ke Rust
- **Rust Engine Service** (Axum 0.8.8) — Gamifikasi, clan, leaderboard (Redis), achievement, missions
- **Core DB** (PostgreSQL) — Database Java untuk users, artikel, kuis, forum, outbox/failed sync
- **Engine DB** (PostgreSQL) — Database Rust untuk shadow users, clan, scores, achievements
- **Redis** — Leaderboard real-time dan cache gamifikasi
- **Google OAuth 2.0** — Sistem autentikasi eksternal untuk SSO

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
  %% Layout settings
  %% Using ELK for cleaner spacing
  %% Define actors
  Pelajar(["Pelajar"])
  Admin(["Admin"])

  %% External systems
  GoogleSSO["Google OAuth<br/>(Layanan Eksternal)"]
  Observability["Sistem Observability<br/>(Sentry, Prometheus, Tempo)"]

  %% System boundary
  subgraph Yomu_System ["Sistem Yomu<br/>(Platform Pembelajaran Poliglot)"]
    subgraph Frontend_Section ["Frontend"]
      FE["Yomu Frontend<br/>(Next.js App Router & BFF)"]
    end

    subgraph Core_Section ["Java Core System"]
      JC["Java Core Service<br/>(Spring Boot 4)"]
      Scheduler["Java Outbox Scheduler<br/>(Retry Job)"]
      JDB[("Core DB<br/>(PostgreSQL)")]
    end

    subgraph Engine_Section ["Rust Gamification Engine"]
      RE["Rust Gamification Engine<br/>(Axum & Tonic)"]
      RDB[("Engine DB<br/>(PostgreSQL)")]
      RC[("Redis Cache")]
    end
  end

  %% Actor interactions
  Pelajar -->|"Mengakses UI aplikasi<br/>(HTTPS)"| FE
  Admin -->|"Mengelola konten & sistem<br/>(HTTPS)"| FE

  %% Frontend relations
  FE <-->|"Mendapatkan ID Token<br/>(Popup/Redirect)"| GoogleSSO
  FE -->|"REST API (JWT)<br/>(Auth, User, Bacaan, Forum)"| JC
  FE -.->|"REST API (Opsional/Planned)<br/>(Leaderboard, Clan, Misi)"| RE

  %% Java Core relations
  JC -->|"Verifikasi ID Token Google"| GoogleSSO
  JC -->|"Simpan kredensial, bacaan & event"| JDB
  JC -->|"Sinkronisasi User, Quiz & Liga<br/>(gRPC + x-api-key)"| RE
  
  %% Scheduler (fault tolerance)
  Scheduler -->|"Membaca failed_sync_events"| JDB
  Scheduler -->|"Retry sinkronisasi gagal<br/>(gRPC + x-api-key)"| RE

  %% Rust Engine relations
  RE -->|"Verifikasi validitas artikel<br/>(Internal REST + x-api-key)"| JC
  RE -->|"Simpan data Clan, Tier & Histori"| RDB
  RE -->|"Cache data Leaderboard"| RC

  %% Observability
  JC -.->|"Kirim Error & Trace"| Observability
  RE -.->|"Kirim Metrics, Error & Trace"| Observability

  %% Styling
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

## Analisis Risiko Arsitektur

Sebagai Risk Analyst, berikut adalah identifikasi risiko teknis pada arsitektur Yomu beserta
strategi mitigasinya berdasarkan diagram-diagram di atas.

### Risiko Tinggi

| ID | Risiko | Komponen Terdampak | Probabilitas | Dampak | Mitigasi |
|----|--------|--------------------|:------------:|:------:|----------|
| R1 | **Single Point of Failure — Single EC2** | Seluruh sistem | Sedang | Kritis | Tambahkan Auto Scaling Group + Load Balancer di fase berikutnya; pastikan health check Docker Compose aktif |
| R2 | **Kegagalan sinkronisasi Java → Rust** | Outbox Scheduler, Engine DB | Tinggi | Tinggi | Outbox pattern sudah ada; pastikan `failed_sync_events` dimonitor dan alert Sentry aktif |
| R3 | **Bocornya JWT / INTERNAL_API_KEY** | Auth, gRPC channel | Rendah | Kritis | Simpan di GitHub Secrets / AWS Secrets Manager; jangan pernah commit ke repo |

### Risiko Sedang

| ID | Risiko | Komponen Terdampak | Probabilitas | Dampak | Mitigasi |
|----|--------|--------------------|:------------:|:------:|----------|
| R4 | **Redis down → leaderboard tidak tersedia** | Rust Engine, Leaderboard | Sedang | Sedang | Redis AOF enabled (sudah dikonfigurasi); pertimbangkan replica untuk produksi |
| R5 | **Drift schema antara Core DB dan Engine DB** | PostgreSQL (keduanya) | Sedang | Sedang | SQLx compile-time check di Rust; Flyway/Liquibase di Java; migration harus di-review bersama |
| R6 | **Google OAuth 2.0 downtime** | Login seluruh user | Rendah | Tinggi | Tidak ada fallback auth saat ini — pertimbangkan local fallback atau caching token |

### Risiko Rendah

| ID | Risiko | Komponen Terdampak | Probabilitas | Dampak | Mitigasi |
|----|--------|--------------------|:------------:|:------:|----------|
| R7 | **Build MDX gagal akibat tag tidak seimbang** | yomu-docs (repo ini) | Tinggi | Rendah | Selalu jalankan `bun run build` sebelum merge; CI GitHub Actions sudah ada |
| R8 | **gRPC timeout antara Java dan Rust** | UserSyncService, QuizSyncService | Sedang | Rendah | Set deadline/timeout eksplisit di client gRPC; retry logic ada di Outbox Scheduler |

### Ringkasan Risk Matrix

              Dampak (Impact)
              Rendah    Sedang    Tinggi    Kritis
            ┌─────────┬─────────┬─────────┬─────────┐
    Tinggi  │   R7    │   R2    │         │         │
            ├─────────┼─────────┼─────────┼─────────┤
    Sedang  │   R8    │ R4, R5  │   R1    │         │
            ├─────────┼─────────┼─────────┼─────────┤
    Rendah  │         │         │   R6    │ R1, R3  │
            └─────────┴─────────┴─────────┴─────────┘

### Prioritas Tindakan

1. **Segera** — Pastikan semua secret (JWT_SECRET, INTERNAL_API_KEY, DB credentials) tidak ada di
   codebase; gunakan environment variable yang di-inject saat deploy.
2. **Sprint ini** — Monitor tabel `failed_sync_events` secara aktif; tambahkan alert jika row
   bertumpuk > threshold tertentu.
3. **Sprint berikutnya** — Evaluasi strategi Redis replica dan disaster recovery untuk PostgreSQL
   (backup otomatis).
4. **Future** — Migrasi ke multi-instance deployment (lihat Future Architecture diagram dari Bayu)
   untuk menghilangkan R1.

---

## Penjelasan Diagram Arsitektur

Bagian ini menjelaskan keempat diagram C4 yang ada di repository ini agar mudah dipahami oleh
developer baru maupun reviewer.

### 1. Context Diagram

**Level C4:** Level 1 — gambaran paling tinggi, siapa yang menggunakan sistem dan sistem eksternal
apa yang berinteraksi.

**Yang ditunjukkan:**
- **Pelajar** dan **Admin** sebagai aktor utama yang mengakses via HTTPS
- **Yomu System** sebagai kotak hitam besar yang berisi seluruh platform
- **Google OAuth** sebagai dependency eksternal untuk autentikasi
- **Sistem Observability** (Sentry, Prometheus, Tempo) sebagai infrastruktur monitoring

**Poin penting:** Diagram ini menunjukkan bahwa Yomu sepenuhnya bergantung pada Google OAuth untuk
login — tidak ada username/password tradisional.

### 2. Container Diagram

**Level C4:** Level 2 — memecah sistem menjadi container (proses/aplikasi yang dapat di-deploy
secara terpisah).

**Yang ditunjukkan:**
- **Next.js Frontend** sebagai BFF (Backend for Frontend) yang menjadi satu-satunya pintu masuk
  bagi user
- **Java Core Service** menangani domain utama: auth, artikel, kuis, forum
- **Rust Engine** menangani domain gamifikasi: clan, leaderboard, achievement, misi
- **3 database terpisah:** Core PostgreSQL, Engine PostgreSQL, dan Redis

**Poin penting:** Java dan Rust **tidak berbagi database** — ini keputusan desain yang disengaja
untuk isolasi domain (lihat Design Decisions di dokumentasi).

### 3. Deployment Diagram

**Level C4:** Level 4 — menunjukkan bagaimana container di-deploy ke infrastruktur nyata.

**Yang ditunjukkan:**
- Semua container berjalan di **satu EC2 instance** via Docker Compose (saat ini)
- **Nginx** sebagai reverse proxy di depan Next.js
- **GitHub Actions** → **GHCR** → **EC2** sebagai pipeline CI/CD
- Pemisahan antara environment variables (tidak sensitif) dan runtime secrets (sensitif)

**Poin penting:** Deployment saat ini adalah *single host* — lihat R1 di Risk Analysis di atas.

### 4. Future Architecture

**Tipe:** Squad-based architecture diagram untuk roadmap pengembangan tim.

**Yang ditunjukkan:**
- Pembagian tim menjadi 4 squad: Frontend, Core, Engagement, Platform
- Rencana pemisahan tanggung jawab yang lebih jelas antar squad
- Pola komunikasi: Frontend → BFF → masing-masing service; Java ↔ Rust via Outbox + Webhook

**Poin penting:** Diagram ini adalah **target arsitektur**, bukan kondisi saat ini. Transisi dari
deployment single-EC2 ke arsitektur ini memerlukan orkestrasi container (Kubernetes atau ECS).


## Modul 9 Individu - Ahmad Anggara B P
```mermaid
flowchart TD
    A[User / Client]

    subgraph YB["Yomu Backend (Spring Boot)"]
        direction TB

        subgraph BK["bacaankuis Module"]

            subgraph ARTICLE["Article Component"]
                AC[ArticleController]
                AS[ArticleService]
                AR[ArticleRepository]

                AC --> AS
                AS --> AR
            end

            subgraph QUIZ["Quiz Component"]
                QC[QuizController]
                QS[QuizService]
                UAR[UserAttemptRepository]

                QC --> QS
                QS --> UAR
            end

        end
    end

    subgraph DB["Database (PostgreSQL)"]
        direction TB

        A1[(Articles Table)]
        Q1[(Quizzes Table)]
        U1[(User Attempts Table)]
    end

    A --> YB

    AR --> A1
    QS --> Q1
    UAR --> U1
```

---

### 2. Code Diagram — Article Module

```mermaid
classDiagram

    class ArticleController {
        +list(category: String)
        +detail(id: String)
    }

    class ArticleService {
        +findAll(category: String)
        +findById(id: String)
        +checkArticleExists(id: String)
    }

    class ArticleRepository {
        +findAll()
        +findByCategoryIgnoreCase(category: String)
        +findById(id: String)
    }

    class Article {
        +id: String
        +title: String
        +content: String
        +category: String
    }

    ArticleController --> ArticleService
    ArticleService --> ArticleRepository
    ArticleRepository --> Article
```

---

### 3. Code Diagram — Quiz Module

```mermaid
classDiagram

    class QuizController {
        +getQuizzes(articleId: String)
        +submitQuiz(articleId: String, req)
    }

    class QuizService {
        +submitAndSync(request)
        +validateRequest(request)
    }

    class UserAttemptRepository {
        +existsByUserIdAndKuisId(userId, kuisId)
        +save(attempt)
    }

    class Quiz {
        +id: String
        +articleId: String
        +question: String
        +answer: String
    }

    class UserAttempt {
        +id: String
        +userId: String
        +quizId: String
        +score: Integer
    }

    QuizController --> QuizService
    QuizService --> UserAttemptRepository
    QuizService --> Quiz
    UserAttemptRepository --> UserAttempt
```

---

### 4. Code Diagram — Quiz Submission Flow

```mermaid
sequenceDiagram
    actor User
    participant QC as QuizController
    participant QS as QuizService
    participant UAR as UserAttemptRepository
    participant DB as PostgreSQL

    User->>QC: submitQuiz(articleId, request)
    QC->>QS: submitAndSync(request)

    QS->>QS: validateRequest(request)

    QS->>UAR: existsByUserIdAndKuisId()
    UAR->>DB: SELECT attempt
    DB-->>UAR: result

    QS->>UAR: save(attempt)
    UAR->>DB: INSERT attempt

    DB-->>UAR: success
    UAR-->>QS: saved attempt
    QS-->>QC: response
    QC-->>User: quiz result
```

---

### 5. Database ER Diagram

```mermaid
erDiagram

    ARTICLES {
        string id PK
        string title
        string content
        string category
    }

    QUIZZES {
        string id PK
        string article_id FK
        string question
        string answer
    }

    USER_ATTEMPTS {
        string id PK
        string user_id
        string quiz_id FK
        int score
    }

    ARTICLES ||--o{ QUIZZES : contains
    QUIZZES ||--o{ USER_ATTEMPTS : attempted_by
```