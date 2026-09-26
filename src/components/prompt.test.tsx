import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Prompt, resolvePromptCancelIndex, stepPromptActionIndex } from './prompt';

describe('Prompt', () => {
  it('renders message, detail, and stacked actions with the first one active', () => {
    const html = renderToStaticMarkup(
      <Prompt
        message="Do you want to trash `audit`?"
        detail="This cannot be undone."
        actions={['Trash', 'Cancel']}
        onRespond={() => undefined}
      />
    );

    expect(html).toContain('role="alertdialog"');
    expect(html).toContain('<code data-slot="prompt-code">audit</code>');
    expect(html).toContain('data-slot="prompt-detail"');
    expect(html.match(/data-slot="prompt-action"/g)).toHaveLength(2);
    expect(html).toMatch(/data-active="true"[^>]*>Trash</);
  });

  it('cycles actions and resolves Escape to Cancel', () => {
    expect(stepPromptActionIndex(0, 3, 1)).toBe(1);
    expect(stepPromptActionIndex(2, 3, 1)).toBe(0);
    expect(stepPromptActionIndex(0, 3, -1)).toBe(2);
    expect(resolvePromptCancelIndex(['Save', "Don't Save", 'Cancel'])).toBe(2);
    expect(resolvePromptCancelIndex(['OK'])).toBe(-1);
  });
});
