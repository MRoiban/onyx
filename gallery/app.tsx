import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { OnyxThemeRoot } from '../src/theme';
import { Foundations } from './foundations';
import Overlays from './sections/overlays';
import Forms, { FormsActions } from './sections/forms';
import Collections, { PaginationCarousel } from './sections/collections';
import { DisplayActions, Feedback, Layout } from './sections/display';
const params = new URLSearchParams(location.search);
function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    params.get('theme') === 'light' ? 'light' : 'dark',
  );
  const [density, setDensity] = useState<'compact' | 'comfortable'>(
    params.get('density') === 'comfortable' ? 'comfortable' : 'compact',
  );
  // Body portals share the chosen theme too.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.density = density;
  }, [theme, density]);
  return (
    <OnyxThemeRoot className="onyx" theme={theme} density={density}>
      <header className="g-bar">
        <h1>Onyx primitives</h1>
        <div className="toggle-group" role="group" aria-label="Theme">
          {(['dark', 'light'] as const).map((value) => (
            <button
              key={value}
              className="toggle"
              aria-pressed={theme === value}
              data-state={theme === value ? 'on' : 'off'}
              onClick={() => setTheme(value)}
            >
              {value === 'dark' ? 'Dark' : 'Light'}
            </button>
          ))}
        </div>
        <div className="toggle-group" role="group" aria-label="Density">
          {(['compact', 'comfortable'] as const).map((value) => (
            <button
              key={value}
              className="toggle"
              aria-pressed={density === value}
              data-state={density === value ? 'on' : 'off'}
              onClick={() => setDensity(value)}
            >
              {value === 'compact' ? 'Compact' : 'Comfortable'}
            </button>
          ))}
        </div>
      </header>
      <Foundations
        actions={
          <>
            <FormsActions />
            <DisplayActions />
          </>
        }
      />
      <Overlays />
      <Forms />
      <Feedback>
        <PaginationCarousel />
      </Feedback>
      <Collections />
      <Layout />
    </OnyxThemeRoot>
  );
}
createRoot(document.getElementById('app')!).render(<App />);
