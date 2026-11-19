import { progressFromEvent, uploadErrorMessage } from './uploadLogic';
import type { UploadFn } from './useUploads';

export interface XhrUploadOptions {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  /** Form field name for the file when sending multipart (the default). */
  fieldName?: string;
  /** Extra form fields sent next to the file (multipart only). */
  fields?: Record<string, string>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  /** `form` sends multipart form data; `raw` sends the file bytes as the body. */
  body?: 'form' | 'raw';
  /** Swap in another XMLHttpRequest (tests, polyfills). */
  createXhr?: () => XMLHttpRequest;
}

/**
 * An `UploadFn` for `useUploads` that sends the file with XMLHttpRequest,
 * because `fetch` cannot report upload progress. Aborting the signal cancels
 * the request; a non-2xx answer rejects with a readable message.
 */
export function xhrUpload(options: XhrUploadOptions): UploadFn {
  const { url, method = 'POST', fieldName = 'file', fields, headers, withCredentials = false, body = 'form', createXhr } = options;

  return (file, { onProgress, signal }) =>
    new Promise<void>((resolve, reject) => {
      const xhr = createXhr ? createXhr() : new XMLHttpRequest();
      xhr.open(method, url);
      xhr.withCredentials = withCredentials;
      for (const [name, value] of Object.entries(headers ?? {})) xhr.setRequestHeader(name, value);

      xhr.upload.onprogress = (e) => onProgress(progressFromEvent(e.loaded, e.lengthComputable ? e.total : 0));
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(100);
          resolve();
        } else {
          reject(new Error(uploadErrorMessage(xhr.status)));
        }
      };
      xhr.onerror = () => reject(new Error('Verbindung unterbrochen'));
      xhr.ontimeout = () => reject(new Error(uploadErrorMessage(408)));
      xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));

      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      signal.addEventListener('abort', () => xhr.abort(), { once: true });

      if (body === 'raw') {
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.send(file);
      } else {
        const form = new FormData();
        for (const [name, value] of Object.entries(fields ?? {})) form.append(name, value);
        form.append(fieldName, file, file.name);
        xhr.send(form);
      }
    });
}
