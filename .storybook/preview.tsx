import { useEffect } from 'react'
import type { Preview } from '@storybook/react-vite'
import '../src/web'
import { ThemeProvider, CssVariables, createLocalStorageAdapter, useTheme } from '../src'
import { breakpoints } from '../src/tokens'
import { gremlinCss } from '../src/primitives/Gremlin'

/**
 * Keeps the theme provider and the document in step with the toolbar:
 * light/dark drives the real ThemeProvider (so every `--chaos-*` variable
 * flips), direction flips `dir` on <html> for right-to-left checks, and the
 * canvas takes the theme background so dark stories don't sit on white.
 */
function ToolbarSync({ theme, direction }: { theme: 'light' | 'dark'; direction: 'ltr' | 'rtl' }) {
  const { setPreference } = useTheme()
  useEffect(() => {
    setPreference(theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])
  useEffect(() => {
    document.documentElement.dir = direction
    document.body.style.background = 'var(--chaos-bg)'
    document.body.style.color = 'var(--chaos-ink)'
  }, [direction])
  return null
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo'
    },

    // Widths the layout rules are specified at: a phone, where table rows
    // become cards, and where a six-column table has room again.
    viewport: {
      options: {
        phone: { name: `Phone ${breakpoints.phone}`, styles: { width: `${breakpoints.phone}px`, height: '812px' }, type: 'mobile' },
        cards: { name: `Cards ${breakpoints.cards}`, styles: { width: `${breakpoints.cards}px`, height: '900px' }, type: 'tablet' },
        table: { name: `Table ${breakpoints.table}`, styles: { width: `${breakpoints.table}px`, height: '900px' }, type: 'tablet' },
        desktop: { name: 'Desktop 1280', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Light or dark theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Text direction (check mirrored layouts)',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to right' },
          { value: 'rtl', title: 'Right to left' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
    direction: 'ltr',
  },

  decorators: [
    (Story, context) => (
      <ThemeProvider storage={createLocalStorageAdapter()}>
        <CssVariables />
        <ToolbarSync
          theme={context.globals.theme === 'dark' ? 'dark' : 'light'}
          direction={context.globals.direction === 'rtl' ? 'rtl' : 'ltr'}
        />
        {/* Powers <Gremlin animation="…" />'s className hooks — consumers are
            expected to inject this themselves; the sketchbook needs it too
            so the animated variants are actually visible here. */}
        <style>{gremlinCss}</style>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
