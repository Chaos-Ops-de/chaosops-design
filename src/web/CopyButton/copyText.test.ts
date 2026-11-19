import { describe, expect, it, vi } from 'vitest';
import { copyText, type CopyDocument } from './copyText';

function fakeDocument(execResult: boolean | 'throw' = true) {
  const area = {
    value: '',
    style: {} as Record<string, string>,
    attrs: {} as Record<string, string>,
    selected: false,
    setAttribute(name: string, value: string) { this.attrs[name] = value; },
    select() { this.selected = true; },
  };
  const body = { appendChild: vi.fn(), removeChild: vi.fn() };
  const doc: CopyDocument = {
    createElement: () => area,
    body,
    execCommand: vi.fn((cmd: string) => {
      if (execResult === 'throw') throw new Error('blocked');
      return cmd === 'copy' && execResult;
    }),
  };
  return { doc, area, body };
}

describe('web/CopyButton copyText', () => {
  it('uses the async clipboard when it works', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const { doc, body } = fakeDocument();
    expect(await copyText('abc', { clipboard: { writeText }, document: doc })).toBe(true);
    expect(writeText).toHaveBeenCalledWith('abc');
    expect(body.appendChild).not.toHaveBeenCalled();
  });

  it('falls back to a textarea when the clipboard rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    const { doc, area, body } = fakeDocument(true);
    expect(await copyText('hello', { clipboard: { writeText }, document: doc })).toBe(true);
    expect(area.value).toBe('hello');
    expect(area.selected).toBe(true);
    expect(area.attrs.readonly).toBe('');
    expect(doc.execCommand).toHaveBeenCalledWith('copy');
    expect(body.appendChild).toHaveBeenCalledTimes(1);
  });

  it('falls back when there is no clipboard at all', async () => {
    const { doc } = fakeDocument(true);
    expect(await copyText('x', { clipboard: null, document: doc })).toBe(true);
  });

  it('always removes the textarea again', async () => {
    const ok = fakeDocument(true);
    await copyText('x', { clipboard: null, document: ok.doc });
    expect(ok.body.removeChild).toHaveBeenCalledTimes(1);

    const failed = fakeDocument(false);
    await copyText('x', { clipboard: null, document: failed.doc });
    expect(failed.body.removeChild).toHaveBeenCalledTimes(1);
  });

  it('resolves false when the fallback refuses', async () => {
    const { doc } = fakeDocument(false);
    expect(await copyText('x', { clipboard: null, document: doc })).toBe(false);
  });

  it('resolves false instead of throwing when the fallback throws', async () => {
    const { doc } = fakeDocument('throw');
    expect(await copyText('x', { clipboard: null, document: doc })).toBe(false);
  });

  it('resolves false with no clipboard and no document', async () => {
    expect(await copyText('x', { clipboard: null, document: null })).toBe(false);
  });
});
