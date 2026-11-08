import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageRow } from './LanguageRow';

const meta = { title: 'Primitives/LanguageRow', component: LanguageRow } satisfies Meta<typeof LanguageRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const LANGS = [{ code: 'de', label: 'Deutsch', flag: '🇩🇪' }, { code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'fr', label: 'Français', flag: '🇫🇷' }];

export const Picker: Story = {
  args: { label: 'Deutsch', selected: true, onPress: () => {} },
  render: () => {
    const [lang, setLang] = useState('en');
    return (
      <View style={{ width: 300, gap: 8 }}>
        {LANGS.map((l) => <LanguageRow key={l.code} label={l.label} leading={l.flag} selected={lang === l.code} onPress={() => setLang(l.code)} />)}
      </View>
    );
  },
};
