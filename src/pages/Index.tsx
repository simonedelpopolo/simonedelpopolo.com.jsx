import { css } from '@nutsloop/neonjsx';

import { AnimationBox } from '../components/AnimationBox';
import { BackToTop } from '../components/BackToTop';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/index/ContentGrid';
import { Hero } from '../components/index/Hero';
import { TableOfContents } from '../components/index/TableOfContents';
import { Sonar } from '../components/pointer/Sonar';
import { initScrollTracker } from '../scripts/scroll-tracker';

/* Content sections data */
const contentSections = [
  {
    id: 'projects',
    title: 'Projects',
    items: [
      {
        title: 'NeonJSX Runtime',
        description: 'Lightweight JSX runtime without virtual DOM diffing. Direct DOM manipulation with zero overhead and minimal bundle size.',
        link: '#',
      },
      {
        title: 'Synth Grid UI',
        description: 'Component library with synthwave neon aesthetic. Pre-built components for building retro-futuristic interfaces.',
        link: '#',
      },
      {
        title: 'Terminal Emulator',
        description: 'Retro terminal with synthwave styling. Full VT100 support with customizable neon color schemes and animations.',
        link: '#',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Libraries',
    items: [
      {
        title: 'Node Graph Editor',
        description: 'Visual node communication system. Build complex data flows with drag-and-drop interface and real-time visualization.',
        link: '#',
      },
      {
        title: 'Theme Builder',
        description: 'Neon palette generator with live preview. Create custom color schemes and export as CSS variables or JSON.',
        link: '#',
      },
      {
        title: 'Animation Studio',
        description: 'SVG animation toolkit for creating smooth transitions. Timeline-based editor with easing presets and export options.',
        link: '#',
      },
    ],
  },
  {
    id: 'experiments',
    title: 'Experiments',
    items: [
      {
        title: 'Particle Systems',
        description: 'WebGL neon particle effects with physics simulation. GPU-accelerated rendering for thousands of particles.',
        link: '#',
      },
      {
        title: 'Audio Visualizer',
        description: 'Frequency-based neon waveforms that react to audio input. Real-time FFT analysis with customizable visualizations.',
        link: '#',
      },
      {
        title: 'Grid Animations',
        description: 'Animated grid transitions with morphing effects. CSS Grid and FLIP technique for smooth layout animations.',
        link: '#',
      },
      {
        title: 'Constellation Network',
        description: 'Interactive node constellation with dynamic connections. Canvas-based particle system with hover interactions.',
        link: '#',
      },
    ],
  },
  {
    id: 'resources',
    title: 'Resources & Learning',
    items: [
      {
        title: 'Synthwave Design Guide',
        description: 'Comprehensive guide to creating authentic 80s-inspired interfaces. Color theory, typography, and visual effects.',
        link: '#',
      },
      {
        title: 'WebGL Fundamentals',
        description: 'Interactive tutorials for GPU programming. Shaders, buffers, and rendering pipelines explained with live examples.',
        link: '#',
      },
      {
        title: 'Performance Optimization',
        description: 'Best practices for high-performance web applications. Profiling, lazy loading, and efficient rendering techniques.',
        link: '#',
      },
      {
        title: 'Accessibility Patterns',
        description: 'ARIA patterns and keyboard navigation for modern web apps. Screen reader testing and inclusive design principles.',
        link: '#',
      },
      {
        title: 'CSS Architecture',
        description: 'Scalable styling systems with BEM, CSS modules, and custom properties. Theming and component isolation strategies.',
        link: '#',
      },
      {
        title: 'Animation Techniques',
        description: 'FLIP animations, spring physics, and easing functions. Creating smooth, performant transitions and micro-interactions.',
        link: '#',
      },
      {
        title: 'TypeScript Deep Dive',
        description: 'Advanced type system features and generic programming. Type inference, conditional types, and utility types.',
        link: '#',
      },
      {
        title: 'Build Tool Mastery',
        description: 'esbuild, Vite, and Rollup configuration guides. Optimizing bundle size and development workflow.',
        link: '#',
      },
      {
        title: 'Testing Strategies',
        description: 'Unit, integration, and E2E testing approaches. TDD workflow, mocking, and visual regression testing.',
        link: '#',
      },
    ],
  },
];

export const Index = () => {
  /* fonts */
  css( './css/fonts/orbitron.css' );
  css( './css/fonts/share-tech-mono.css' );
  css( './css/fonts/syncopate.css' );
  css( './css/fonts/audiowide.css' );
  /* component styles */
  css( './css/pages/index.css' );

  /* initialize scroll tracking after render */
  if ( typeof window !== 'undefined' ) {
    setTimeout( () => {
      initScrollTracker();
    }, 100 );
  }

  return (
    <>
      <Hero />
      <Header />
      <div class="index__layout">
        <TableOfContents sections={contentSections} />
        <main class="index">
          <ContentGrid sections={contentSections} />
        </main>
      </div>
      <Footer />
      <BackToTop />
      <AnimationBox />
      <Sonar />
    </>
  );
};
