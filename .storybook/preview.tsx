import type { Preview } from '@storybook/react-vite'
import '../src/web'
import { ThemeProvider, CssVariables, createLocalStorageAdapter } from '../src'
import { gremlinCss } from '../src/primitives/Gremlin'

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
  },
  decorators: [
    (Story) => (
      <ThemeProvider storage={createLocalStorageAdapter()}>
        <CssVariables />
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
