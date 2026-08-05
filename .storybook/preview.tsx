import type { Preview } from '@storybook/react-vite'
import '../src/web'
import { ThemeProvider, CssVariables, createLocalStorageAdapter } from '../src'

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
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
