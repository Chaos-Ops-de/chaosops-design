/** The slice of `navigator.clipboard` that copying needs. */
export interface CopyClipboard {
  writeText(text: string): Promise<void>;
}

/** The slice of `document` the textarea fallback needs. */
export interface CopyDocument {
  createElement(tag: 'textarea'): {
    value: string;
    style: Record<string, string>;
    setAttribute(name: string, value: string): void;
    select(): void;
  };
  body: {
    appendChild(node: unknown): unknown;
    removeChild(node: unknown): unknown;
  };
  execCommand(command: string): boolean;
}

export interface CopyDeps {
  /** `null` forces the fallback (insecure origins, older browsers). */
  clipboard?: CopyClipboard | null;
  document?: CopyDocument | null;
}

function defaultDeps(): CopyDeps {
  return {
    clipboard: typeof navigator !== 'undefined' ? (navigator.clipboard as CopyClipboard | undefined) ?? null : null,
    document: typeof document !== 'undefined' ? (document as unknown as CopyDocument) : null,
  };
}

/**
 * Copies `text` to the clipboard. Tries the async Clipboard API first and
 * falls back to a hidden textarea plus `execCommand('copy')`. Resolves to
 * whether anything was copied; it never throws.
 */
export async function copyText(text: string, deps: CopyDeps = defaultDeps()): Promise<boolean> {
  const { clipboard, document: doc } = { ...defaultDeps(), ...deps };

  if (clipboard) {
    try {
      await clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or not focused: fall through to the textarea route.
    }
  }

  if (!doc) return false;
  const area = doc.createElement('textarea');
  try {
    area.value = text;
    area.setAttribute('readonly', '');
    area.setAttribute('aria-hidden', 'true');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.opacity = '0';
    doc.body.appendChild(area);
    area.select();
    return doc.execCommand('copy') === true;
  } catch {
    return false;
  } finally {
    try {
      doc.body.removeChild(area);
    } catch {
      // Already detached.
    }
  }
}
