import { css } from '@nutsloop/neonjsx';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

export const About = () => {
  /* fonts */
  css( './css/fonts/bungee.css' );
  css( './css/fonts/intel-one-mono.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/syncopate.css' );
  /* theme */
  css( './css/theme.css' );
  /* page styles */
  css( './css/pages/about.css' );

  return (
    <>
      <Header />
      {/*<main class="about">
        <section class="about__hero" aria-labelledby="about-hero-title">
          <div class="about__hero-media" role="img" aria-label="Portrait placeholder">
            <div class="about__hero-subject" aria-hidden="true" />
          </div>

          <div class="about__hero-overlay">
            <h1 class="about__about">About</h1>
            <p class="about__role">▸ Systems Architect ✶ Chef • Baker</p>
            <p id="about-hero-title" class="about__name">Simone Del Popolo</p>
            <p class="about__title">From Rome to Iceland, building systems in kitchens and networks.</p>
          </div>
        </section>

        <section class="about__bio" aria-labelledby="about-bio-title">
          <div class="about__bio-container">
            <h2 id="about-bio-title" class="about__section-title">Biography</h2>
            <p class="about__bio-text">
              Born in Rome on March 30, 1980. My first program ran on a Commodore 64 around 1987-1988.
              I completed a Liceo Scientifico diploma in 1999 and did not pursue a university degree or PhD.
            </p>
            <p id="early-systems" class="about__bio-text">
              In 2001 I discovered the PC world and taught myself C++. I worked as a junior accountant at a
              wholesale fish company until 2005, while also running a small PC technical-assistance business
              handling Windows recovery, upgrades, and custom builds.
            </p>
            <p id="lens-web" class="about__bio-text">
              I studied photography in 2008, opened a photography studio in 2013, and kept building for the web
              in parallel.
            </p>
            <p id="kitchen-bakery" class="about__bio-text">
              In 2014 I shifted into professional cooking, a practice I continue in 2026, now preparing to open
              a bakery in Iceland.
            </p>

            <h3 class="about__callout-title">
              <span class="about__highlight">NEON-SIGNAL-LAB</span>
              <span class="about__callout-tag">Founder</span>
            </h3>
            <p id="neon-signal-lab" class="about__bio-text">
              On November 25, 2025 I sketched the Neon Signal LAB start-up idea: a distributed network of
              servers sharing signals and strengthening each other. The main node, neon-grid, seeds the system,
              while satellite nodes (neon-riders) connect to it. These include neonsignal, simonedelpopolo, and
              skinjo. The first proof of concept centers on HTTP/2 with TLS and an SSE relay, with an experimental
              secure UDP lane for low-latency signaling.
            </p>
          </div>
        </section>

        <section class="about__resources" aria-labelledby="about-resources-title">
          <div class="about__resources-container">
            <h2 id="about-resources-title" class="about__section-title">Resources</h2>
            <p class="about__resources-lead">Preview of the core threads behind the work.</p>

            <div class="about__resources-grid">
              <a class="about__resource-card" href="#early-systems">
                <h3 class="about__resource-title">Early Systems</h3>
                <p class="about__resource-caption">Commodore 64 roots, self-taught C++, and hands-on PC repair.</p>
                <span class="about__resource-meta">Jump →</span>
              </a>

              <a class="about__resource-card" href="#lens-web">
                <h3 class="about__resource-title">Lens + Web</h3>
                <p class="about__resource-caption">Photography studies, studio work, and web development in parallel.</p>
                <span class="about__resource-meta">Jump →</span>
              </a>

              <a class="about__resource-card" href="#kitchen-bakery">
                <h3 class="about__resource-title">Kitchen → Bakery</h3>
                <p class="about__resource-caption">Chef since 2014, now preparing a bakery opening in Iceland.</p>
                <span class="about__resource-meta">Jump →</span>
              </a>

              <a class="about__resource-card" href="#neon-signal-lab">
                <h3 class="about__resource-title">Neon Signal LAB</h3>
                <p class="about__resource-caption">Neon-grid main node with neon-rider satellites and shared signals.</p>
                <span class="about__resource-meta">Open →</span>
              </a>
            </div>
          </div>
        </section>
      </main>*/}
      <main class="about">

        <section class="about__hero" aria-labelledby="about-hero-title">
          <div class="about__hero-media" role="img" aria-label="Portrait placeholder">
            <div class="about__hero-subject" aria-hidden="true"></div>
          </div>

          <div class="about__hero-overlay">
            <h1 class="about__about">About</h1>
            <p class="about__role">▸ Systems Architect ✶ Chef • Baker</p>
            <p id="about-hero-title" class="about__name">Simone Del Popolo</p>
            <p class="about__title">From Rome to Iceland, building systems in kitchens and networks.</p>

            <p class="about__subtitle">
              I like environments where failure is expensive and timing matters — dinner rushes, production incidents,
              fermentation windows. That’s where systems become real.
            </p>
          </div>
        </section>

        <section class="about__bio" aria-labelledby="about-bio-title">
          <div class="about__bio-container">
            <h2 id="about-bio-title" class="about__section-title">A human bio</h2>

            <p class="about__bio-text">
              I was born in Rome in 1980. My first obsession with systems started early: a Commodore 64 and the feeling
              that a few lines of code could turn chaos into behavior.
            </p>

            <p id="early-systems" class="about__bio-text">
              Later I taught myself C++ and spent years fixing PCs and rescuing broken Windows installs — not because it
              was glamorous, but because it trained me to stay calm, isolate variables, and ship a fix under pressure.
              That mindset never left.
            </p>

            <p id="lens-web" class="about__bio-text">
              I studied photography and ran a studio — another kind of system: light, timing, trust, and taste. In parallel,
              I kept building for the web, slowly collecting the tools and habits I use today.
            </p>

            <p id="kitchen-bakery" class="about__bio-text">
              In 2014 I moved into professional kitchens. Kitchens are distributed systems with heat instead of packets.
              In 2026 I’m still cooking — and preparing to open a bakery in Iceland — while building a network experiment
              that started as a sketch and became a prototype.
            </p>

            <div class="about__principles" aria-label="Principles">
              <h3 class="about__callout-title">
                <span class="about__highlight">How I build</span>
                <span class="about__callout-tag">Principles</span>
              </h3>

              <ul class="about__list">
                <li><strong>Pressure-tested simplicity.</strong> One clear loop beats ten clever threads.</li>
                <li><strong>Operational honesty.</strong> If it can’t be observed, it can’t be trusted.</li>
                <li><strong>Craft over hype.</strong> The work should explain itself when the lights go out.</li>
                <li><strong>Playful rigor.</strong> Experiments are welcome; excuses aren’t.</li>
              </ul>
            </div>
          </div>
        </section>

        <section class="about__lab" aria-labelledby="about-lab-title">
          <div class="about__bio-container">
            <h2 id="about-lab-title" class="about__section-title">Neon Signal LAB</h2>

            <p class="about__bio-text">
              Neon Signal LAB is a high-risk infrastructure idea: a network of small servers that can discover each other,
              exchange signals, and become stronger together — not by centralizing power, but by cooperating.
            </p>

            <p class="about__bio-text">
              Read between the lines: this isn’t a “startup pitch deck” yet. It’s a proof-of-concept that aims to grow into
              something capital-efficient and weirdly resilient — the kind of thing angels back because it’s either nothing
              or it changes the rules for a niche that keeps expanding.
            </p>

            <div class="about__tags" aria-label="Tags">
              <span class="about__tag">#neonsignal</span>
              <span class="about__tag">#SoC</span>
              <span class="about__tag">#auto-discoverability-neonsignal-servers</span>
            </div>

            <h3 class="about__callout-title">
              <span class="about__highlight">NEON-SIGNAL-LAB</span>
              <span class="about__callout-tag">Draft • Proof of Concept</span>
            </h3>

            <p class="about__bio-text" id="neon-signal-lab">
              The core concept is simple: one “seed” node helps new nodes join safely; once inside, nodes exchange tiny,
              signed signals (heartbeats, presence, capabilities, small payload relays). The network learns who is alive,
              who is useful, and how to route information without relying on a single fragile path.
            </p>

            <div class="about__lab-grid" role="group" aria-label="Network topology">
              <div class="about__lab-card">
                <h4 class="about__lab-title">Main node: neon-grid</h4>
                <p class="about__lab-text">
                  The seed. A known entry point that bootstraps trust, keeps a registry, and helps nodes find each other.
                  Ideally reachable by IP to reduce dependency on public web assumptions.
                </p>
                <p class="about__lab-meta">
                  Entry: <a href="https://www.nutsloop.com" target="_blank" rel="noopener">main-server</a> (or IP)
                </p>
              </div>

              <div class="about__lab-card">
                <h4 class="about__lab-title">Satellites: neon-riders</h4>
                <p class="about__lab-text">
                  Small servers that join the grid, contribute signals, and can host apps, relays, content, or specialized roles.
                  Each rider can be generic — until it’s not.
                </p>

                <ul class="about__list about__list--compact">
                  <li><a href="https://neonsignal.nutsloop.com" target="_blank" rel="noopener">neonsignal</a> — generic rider</li>
                  <li><a href="https://www.simonedelpopolo.com" target="_blank" rel="noopener">simonedelpopolo</a> — generic rider</li>
                  <li><a href="https://skinjo.org" target="_blank" rel="noopener">skinjo</a> — generic rider</li>
                </ul>
              </div>
            </div>

            <div class="about__investor" aria-label="Investor lens">
              <h3 class="about__section-title about__section-title--small">Why it could matter</h3>

              <ul class="about__list">
                <li>
                  <strong>Auto-discoverability.</strong> Nodes learn the network with minimal configuration — small seed lists,
                  then registry-based joining.
                </li>
                <li>
                  <strong>Security as default posture.</strong> Every signal is signed; unsigned payloads are rejected. Trust is explicit.
                </li>
                <li>
                  <strong>Dual-lane transport.</strong> A reliable control plane (HTTP/2 + TLS + SSE) plus an optional low-latency lane (UDP),
                  never “UDP or nothing”.
                </li>
                <li>
                  <strong>SoC mindset.</strong> Small, composable primitives that can be embedded in other systems without rewriting everything.
                </li>
                <li>
                  <strong>Capital efficient.</strong> Start tiny: 1 seed + 2 riders. Prove it works. Then scale by function, not hype.
                </li>
              </ul>
            </div>

            <div class="about__poc" aria-label="Proof of concept">
              <h3 class="about__section-title about__section-title--small">Proof of concept (tiny by design)</h3>

              <p class="about__bio-text">
                This is not a white paper. It’s a constrained prototype with measurable “it works” criteria:
                connect, stream, relay, verify.
              </p>

              <ul class="about__list">
                <li><strong>Scope:</strong> 1 main + 2 satellites, single region (Oracle Linux 10 arm64 target)</li>
                <li><strong>Success:</strong> HTTP/2 established, SSE heartbeat streaming, one signed payload relayed end-to-end</li>
                <li><strong>Identity:</strong> Ed25519 node identity, reject unsigned payloads</li>
                <li><strong>Ops gate:</strong> WebAuthn for admin/ops entry points</li>
                <li><strong>Registry:</strong> libmdbx-backed node status table, sane limits and guardrails</li>
              </ul>
            </div>

            <div class="about__udp" aria-label="UDP transport teaser">
              <h3 class="about__section-title about__section-title--small">UDP lane (experimental)</h3>

              <p class="about__bio-text">
                UDP is treated as a side-car: optional, fast, and hostile by default. If it’s enabled, it’s authenticated, rate-limited,
                replay-protected — and it can always fall back to the HTTP/2 control plane.
              </p>

              <ul class="about__list about__list--compact">
                <li><strong>Use:</strong> discovery, heartbeats, fast telemetry, small payload relays</li>
                <li><strong>Rules:</strong> signed packets only, strict caps, clock bounds, ACK only when needed</li>
                <li><strong>Fallback:</strong> if NAT or policy blocks UDP, control plane remains stable</li>
              </ul>
            </div>

            <div class="about__ask" aria-label="Call to action">
              <h3 class="about__callout-title">
                <span class="about__highlight">Looking for</span>
                <span class="about__callout-tag">Angels with taste</span>
              </h3>

              <p class="about__bio-text">
                If you’re an angel who enjoys infrastructure that feels inevitable in hindsight — and you’re comfortable backing
                prototypes before the story is polished — I’m happy to share the current build, the threat model, and the path from
                PoC to something real.
              </p>

              <p class="about__bio-text">
                <a class="about__cta" href="contact.html">Contact →</a>
                <span class="about__cta-hint">Short message is enough. Curiosity welcome.</span>
              </p>
            </div>
          </div>
        </section>

        <section class="about__resources" aria-labelledby="about-resources-title">
          <div class="about__resources-container">
            <h2 id="about-resources-title" class="about__section-title">Resources</h2>
            <p class="about__resources-lead">A few threads behind the work.</p>

            <div class="about__resources-grid">
              <a class="about__resource-card" href="#early-systems">
                <h3 class="about__resource-title">Early Systems</h3>
                <p class="about__resource-caption">Commodore roots, self-taught C++, hands-on repair culture.</p>
                <span class="about__resource-meta">Jump →</span>
              </a>

              <a class="about__resource-card" href="#lens-web">
                <h3 class="about__resource-title">Lens + Web</h3>
                <p class="about__resource-caption">Photography, studio work, and web building in parallel.</p>
                <span class="about__resource-meta">Jump →</span>
              </a>

              <a class="about__resource-card" href="#kitchen-bakery">
                <h3 class="about__resource-title">Kitchen → Bakery</h3>
                <p class="about__resource-caption">Chef since 2014, now preparing a bakery opening in Iceland.</p>
                <span class="about__resource-meta">Jump →</span>
              </a>

              <a class="about__resource-card" href="#neon-signal-lab">
                <h3 class="about__resource-title">Neon Signal LAB</h3>
                <p class="about__resource-caption">Seed node + riders, signed signals, discoverability, dual-lane transport.</p>
                <span class="about__resource-meta">Open →</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
