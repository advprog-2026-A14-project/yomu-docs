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

### Mermaid Diagrams

Gunakan blok mermaid untuk diagram:

```mermaid
graph TD
    A[Frontend Next.js] --> B[Java Backend]
    B --> B[Rust Backend] --> C[PostgreSQL]
```

Future Architecture
```mermaid
flowchart TB
  User["Web / Mobile Users"]
  Internet((Internet))
  Google["External Service<br/>Google OAuth2 API<br/>oauth2.googleapis.com/tokeninfo"]

  subgraph PROD["Production Deployment Environment"]
    direction TB

    subgraph FRONT_HOST["Deployment Node: Frontend Docker Host / VM"]
      direction TB
      subgraph FRONT_CONT["Execution Environment: Container yomu-frontend"]
        direction TB
        Next["Artifact: Next.js 16 Standalone Server<br/>Node runtime<br/>Port :3000"]
        Pages["Artifact: App Router Pages<br/>React 19 + Tailwind + shadcn/ui"]
        BFF["Artifact: Next Route Handlers / BFF<br/>/api/v1/auth<br/>/api/v1/users<br/>/api/v1/forums"]
        Cookie[("HttpOnly Auth Cookie<br/>AUTH_COOKIE_NAME<br/>sameSite=lax")]
        Mock[("Local Mock Data<br/>articles / quizzes")]
      end
    end

    subgraph K8S["Deployment Node: Kubernetes Cluster - Java Core API"]
      direction TB
      Ingress["Infrastructure Node: Ingress<br/>api.yomu.example.com"]
      JavaSvc["Infrastructure Node: Service<br/>yomu-java-core-service<br/>ClusterIP :80 -> :8080"]

      subgraph JAVA_DEPLOY["Execution Environment: Deployment yomu-java-core<br/>3 replicas, role=web"]
        direction LR
        Web1["Pod 1<br/>Spring Boot REST API<br/>Auth, User, Article, Quiz, Forum, Admin"]
        Web2["Pod 2<br/>Spring Boot REST API<br/>JWT stateless<br/>JPA repositories"]
        Web3["Pod 3<br/>Spring Boot REST API<br/>Actuator readiness/liveness"]
      end

      Scheduler["Execution Environment: Deployment yomu-java-outbox-scheduler<br/>1 replica<br/>OUTBOX_SCHEDULER_ENABLED=true<br/>retry every 5 minutes"]
      JavaDB[("Data Store: PostgreSQL Service<br/>postgres-service :5432<br/>Database: yomu_db")]
      Config["ConfigMap<br/>SERVER_PORT, CORS, Rust host/port,<br/>DB pool, JWT issuer/audience"]
      Secret["Secret<br/>DB credentials, JWT_SECRET,<br/>INTERNAL_API_KEY,<br/>GOOGLE_OAUTH_CLIENT_ID"]
      RustSvc["Infrastructure Node: Rust Engine Service<br/>rust-engine-service<br/>gRPC :9090<br/>REST :8080 optional"]
    end

    subgraph RUST_HOST["Deployment Node: Rust Engine Runtime<br/>Docker Compose / Railway"]
      direction TB
      subgraph YOMU_NET["Execution Environment: Docker Network yomu-network"]
        direction TB
        RustApp["Container: yomu-engine<br/>Rust Axum + Tonic<br/>HTTP :8080<br/>gRPC :9090<br/>/health /metrics /swagger-ui<br/>runs SQLx migrations on startup"]
        RustDB[("Container: yomu-postgres<br/>PostgreSQL 18<br/>Port :5432")]
        Redis[("Container: yomu-redis<br/>Redis 8 Alpine<br/>Port :6379<br/>AOF enabled")]
      end
      PgVol[("Volume: postgres_data")]
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
  Internet -->|":3000"| Next
  Next --> Pages
  Pages -->|"same-origin fetch<br/>/api/v1/..."| BFF
  Pages <-->|"Google sign-in popup / token"| Google
  BFF -->|"set / clear cookie"| Cookie
  User -->|"sends cookie automatically"| BFF
  Pages -->|"read quiz / catalog data"| Mock

  %% Frontend to Java Core Backend
  BFF -->|"REST + JWT<br/>/api/v1/auth<br/>/api/v1/users<br/>/api/v1/articles<br/>/api/v1/quizzes<br/>/api/v1/forums"| Ingress
  Ingress --> JavaSvc
  JavaSvc --> Web1
  JavaSvc --> Web2
  JavaSvc --> Web3

  %% Java Core to Database and External Services
  Web1 -->|"JDBC / HikariCP"| JavaDB
  Web2 -->|"JDBC / HikariCP"| JavaDB
  Web3 -->|"JDBC / HikariCP"| JavaDB
  Scheduler -->|"JDBC<br/>read failed_sync_events<br/>update retry status"| JavaDB
  Web1 -->|"verify Google ID token"| Google
  Web2 -->|"verify Google ID token"| Google
  Web3 -->|"verify Google ID token"| Google

  %% Java Core to Rust Engine
  Web1 -->|"gRPC + x-api-key<br/>UserSyncService<br/>QuizSyncService<br/>LeagueService"| RustSvc
  Web2 -->|"gRPC + x-api-key"| RustSvc
  Web3 -->|"gRPC + x-api-key"| RustSvc
  Scheduler -->|"retry sync<br/>gRPC + x-api-key"| RustSvc
  RustSvc -->|"routes to runtime"| RustApp
  RustApp -->|"internal REST + x-api-key<br/>/api/internal/articles/{article_id}/exists"| JavaSvc

  %% Optional direct frontend to Rust Engine from env
  BFF -.->|"RUST_ENGINE_URL exists<br/>optional / planned direct call"| RustApp

  %% Rust Engine Persistence and Observability
  RustApp -->|"SQLx pool<br/>DATABASE_URL"| RustDB
  RustApp -->|"Redis connection<br/>REDIS_URL"| Redis
  RustDB --- PgVol
  Redis --- RedisVol
  Prom -->|"GET /metrics"| RustApp
  RustApp -->|"OTLP traces"| Tempo
  RustApp -->|"errors / APM"| Sentry

  %% Config and Secret Injection
  Config -. "envFrom" .-> Web1
  Config -. "envFrom" .-> Web2
  Config -. "envFrom" .-> Web3
  Config -. "envFrom" .-> Scheduler
  Secret -. "envFrom" .-> Web1
  Secret -. "envFrom" .-> Web2
  Secret -. "envFrom" .-> Web3
  Secret -. "envFrom" .-> Scheduler

  %% CI/CD
  GitHub --> Actions
  Actions -->|"build and push image"| GHCR
  GHCR -->|"deploy / pull image"| RustApp

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
  class FRONT_HOST,K8S,RUST_HOST,PROD host;
  class Next,Pages,BFF,FRONT_CONT frontend;
  class Ingress,JavaSvc,Web1,Web2,Web3,Scheduler,Config,Secret,JAVA_DEPLOY java;
  class RustSvc,RustApp,YOMU_NET rust;
  class JavaDB,RustDB,Redis,PgVol,RedisVol,Cookie,Mock data;
  class Internet infra;
  class Prom,Tempo,Sentry,GitHub,Actions,GHCR,OBS,CICD support;
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
