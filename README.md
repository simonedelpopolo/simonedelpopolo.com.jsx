# simonedelpopolo.com

Personal landing site built with **NeonJSX** and bundled with **esbuild**.

A lightweight JSX runtime that converts virtual nodes directly to DOM, no diffing, no hooks.

---

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build:_default

# Or clean + build
npm run all:_default
```

Output lands in `public/_default/`. Serve with any static server.

---

## NeonJSX Runtime

Custom lightweight JSX implementation from `@nutsloop/neonjsx`:

| Function | Purpose |
|----------|---------|
| `h(type, props, ...children)` | JSX factory - creates virtual nodes |
| `Fragment` | Groups children without wrapper element |
| `render(node, parent)` | Mounts virtual tree to DOM |
| `css(url)` | Loads stylesheet once (deduped) |

**No virtual DOM diffing** - direct render on mount. Components load styles on-demand via `css()`.

---

## Styling

**Synthwave neon aesthetic** with CSS custom properties:

```css
--neon-pink: #ff00ff
--neon-cyan: #00ffff
--neon-purple: #a855f7
--neon-orange: #ff6600
--neon-green: #00ff88
--void-black: #0a0a0f
```

**Fonts** (Google Fonts, loaded on-demand):
- Orbitron - futuristic display
- Share Tech Mono - body text
- Syncopate - wide-spaced headers
- Audiowide - arcade style
- Press Start 2P - retro gaming
- Intel One Mono - terminal
- Bungee - bold signage
- Monoton - neon outlines

---

## Routing

`app.tsx` checks NeonSignal server globals:

```typescript
if (window.__NEON_STATUS === 404) {
  render(<NotFound path={window.__NEON_PATH} />, root);
} else {
  render(<Index />, root);
}
```

---

## Commands

| Command | Action |
|---------|--------|
| `npm run build:_default` | Bundle + copy assets |
| `npm run clean:_default` | Remove build outputs |
| `npm run all:_default` | Clean + build |
| `npm run lint` | Check code style |
| `npm run lint-fix` | Auto-fix issues |

### Build Options

```bash
# Custom TLD for links
npm run build:_default -- --tld .com

# Custom output directory
npm run build:_default -- --public ./dist
```

---

## Configuration

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript + JSX config |
| `eslint.config.js` | Linting rules (flat config) |
| `scripts/global_variables.sh` | Build environment |

**TypeScript JSX**:
```json
{
  "jsx": "react-jsx",
  "jsxImportSource": "@nutsloop/neonjsx"
}
```

**esbuild flags**:
```
--jsx-factory=h --jsx-fragment=Fragment
```

---

## SSL Certificates

> **Required before running NeonSignal** - the server is HTTP/2 only and requires TLS.

### Generate Local Development Certificates

The `scripts/certificates/issuer.sh` script manages a local CA for development:

```bash
# Generate all configured certificates
./scripts/certificates/issuer.sh --local generate-all

# Generate certificate for a specific host
./scripts/certificates/issuer.sh --local generate <hostname> [dir_name]

# Example: generate for local IP
./scripts/certificates/issuer.sh --local generate 10.0.0.106 _default

# Check certificate status
./scripts/certificates/issuer.sh --local verify

# Show all certificate info
./scripts/certificates/issuer.sh status
```

### Custom Certificate Directory

```bash
# Use a custom certs directory
./scripts/certificates/issuer.sh --certs ./my-certs --local generate-all
```

### Output Structure

```
certs/
├── ca/
│   ├── root.crt              # CA certificate (trust in your OS)
│   └── root.key              # CA private key
└── _default/
    ├── fullchain.pem         # Server certificate
    └── privkey.pem           # Server private key
```

### Trust the CA (macOS)

```bash
# Add CA to system keychain
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain certs/ca/root.crt
```

### Trust the CA (Linux)

```bash
# Copy CA to trusted certificates
sudo cp certs/ca/root.crt /usr/local/share/ca-certificates/nutsloop-dev.crt
sudo update-ca-certificates
```

---

## NeonSignal Server

[NeonSignal](https://github.com/nutsloop/neonsignal) is an HTTP/2 static file server with SNI virtual hosting.

### Prerequisites

1. SSL certificates generated (see above)
2. NeonSignal binaries built from source (requires Meson)

### Running the Server

```bash
# Basic usage - serve public/_default on port 9443
./neonsignal spin --www-root=public --certs-root=certs --port=9443

# With custom settings
./neonsignal spin \
  --host=0.0.0.0 \
  --port=443 \
  --threads=4 \
  --www-root=public \
  --certs-root=certs

# For systemd service
./neonsignal --systemd --www-root=public --certs-root=certs
```

### HTTP to HTTPS Redirect

```bash
# Run the redirect server (HTTP:80 -> HTTPS:443)
./neonsignal_redirect spin --port=80 --target-port=443
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEONSIGNAL_THREADS` | 3 | Worker thread count |
| `NEONSIGNAL_HOST` | 0.0.0.0 | Bind address |
| `NEONSIGNAL_PORT` | 9443 | HTTPS port |
| `NEONSIGNAL_WWW_ROOT` | public | Static files directory |
| `NEONSIGNAL_CERTS_ROOT` | certs | TLS certificates directory |

### Directory Structure for Virtual Hosting

NeonSignal uses SNI-based virtual hosting. Organize files by domain:

```
public/
├── _default/                 # Default/fallback site
│   ├── app.js
│   ├── index.html
│   └── css/
├── simonedelpopolo.com/      # Domain-specific
│   └── ...
└── other.domain.com/
    └── ...

certs/
├── _default/
│   ├── fullchain.pem
│   └── privkey.pem
├── simonedelpopolo.com/
│   ├── fullchain.pem
│   └── privkey.pem
└── ca/
    └── root.crt
```

### Quick Development Setup

```bash
# 1. Build the site
npm run all:_default

# 2. Generate SSL certificates
./scripts/certificates/issuer.sh --local generate-all


# 3. clone the neonsignal repo
git clone https://github.com/nutsloop/neonsignal.git

# 4. compile with meson
meson setup build
meson compile -C build

# 5 add neonsignal executable to you $PATH
neonsignal spin \
  --www-root=public \
  --certs-root=certs \
  --host=0.0.0.0
  --port=9443

# 6. Open the website
open https://0.0.0.0:9443

```

---

## Creating Pages with Table of Contents

The `TableOfContents` component is reusable across pages. It provides automatic scroll tracking and smooth navigation.

### Basic Usage

```tsx
import { TableOfContents } from '../components/index/TableOfContents';
import { ContentGrid } from '../components/index/ContentGrid';
import { initScrollTracker } from '../scripts/scroll-tracker';

/* Define your content sections */
const sections = [
  {
    id: 'section-one',        // Anchor ID for linking
    title: 'Section One',     // Display name in ToC
    items: [
      {
        title: 'Item Title',
        description: 'Item description text',
        link: '#',            // Or actual URL
      },
      /* more items... */
    ],
  },
  /* more sections... */
];

export const MyPage = () => {
  /* Initialize scroll tracking after render */
  if ( typeof window !== 'undefined' ) {
    setTimeout( () => {
      initScrollTracker();
    }, 100 );
  }

  return (
    <>
      <Header />
      <div class="page__layout">
        <TableOfContents sections={sections} />
        <main class="page">
          <ContentGrid sections={sections} />
        </main>
      </div>
      <Footer />
    </>
  );
};
```

### Layout CSS

Add to your page CSS file (e.g., `src/static/css/pages/mypage.css`):

```css
.page__layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

.page {
  min-width: 0;
}

/* Tablet */
@media (max-width: 1024px) {
  .page__layout {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 2.5rem 1.25rem 4rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .page__layout {
    padding: 2rem 1rem 3rem;
  }
}
```

### Features

- **Auto-scroll tracking**: Highlights active section as you scroll
- **Smooth navigation**: Click ToC links to smoothly scroll to sections
- **Mobile responsive**: Collapsible ToC on screens < 1024px
- **URL hash updates**: Browser history tracks section navigation
- **Theme-aware**: Supports dark/light themes via CSS variables

### Component Props

**TableOfContents**:
```tsx
interface TocSection {
  id: string;      // Must match section anchor ID
  title: string;   // Display text in ToC
}

sections: TocSection[]
```

**ContentGrid**:
```tsx
interface GridItem {
  title: string;
  description: string;
  link: string;
}

interface ContentSection {
  id: string;               // Anchor ID
  title: string;            // Section heading
  items: GridItem[];        // Cards in grid
}

sections: ContentSection[]
```

### Customization

The components use CSS custom properties from `theme.css`:
- `--link-hover`: ToC link hover color
- `--link-active`: Active ToC item color
- `--border-accent`: Section header underline
- `--bg-card`: Grid card background

Override in your page-specific CSS if needed.

---

## Tech Stack

- **Runtime**: @nutsloop/neonjsx ^1.2.2
- **Bundler**: esbuild ^0.27.2
- **Language**: TypeScript ^5.9.3
- **Linting**: ESLint 9 + @typescript-eslint
- **Server**: [NeonSignal](https://github.com/nutsloop/neonsignal) (HTTP/2, TLS 1.3+)

---

## License

Apache License 2.0
