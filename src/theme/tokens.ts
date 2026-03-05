export const ONYX_THEME_VARIABLES = {
  surfaceApp: '--onyx-surface-app',
  surfaceEditor: '--onyx-surface-editor',
  surfacePanel: '--onyx-surface-panel',
  surfaceSidebar: '--onyx-surface-sidebar',
  surfaceMenu: '--onyx-surface-menu',
  surfaceDialog: '--onyx-surface-dialog',
  surfaceOverlay: '--onyx-surface-overlay',
  textForeground: '--onyx-text-foreground',
  textMuted: '--onyx-text-muted',
  textDescription: '--onyx-text-description',
  textLink: '--onyx-text-link',
  textInverse: '--onyx-text-inverse',
  controlButtonBg: '--onyx-control-button-bg',
  controlButtonFg: '--onyx-control-button-fg',
  controlButtonHoverBg: '--onyx-control-button-hover-bg',
  controlSecondaryBg: '--onyx-control-secondary-bg',
  controlSecondaryFg: '--onyx-control-secondary-fg',
  controlSecondaryHoverBg: '--onyx-control-secondary-hover-bg',
  controlDestructiveBg: '--onyx-control-destructive-bg',
  controlDestructiveFg: '--onyx-control-destructive-fg',
  controlInputBg: '--onyx-control-input-bg',
  controlInputFg: '--onyx-control-input-fg',
  controlInputBorder: '--onyx-control-input-border',
  controlFocusRing: '--onyx-control-focus-ring',
  stateHover: '--onyx-state-hover',
  stateActive: '--onyx-state-active',
  stateSelected: '--onyx-state-selected',
  stateDisabled: '--onyx-state-disabled',
  stateWarning: '--onyx-state-warning',
  stateError: '--onyx-state-error',
  stateSuccess: '--onyx-state-success',
  shellActivityBarBg: '--onyx-shell-activity-bar-bg',
  shellActivityBarFg: '--onyx-shell-activity-bar-fg',
  shellActivityBarInactiveFg: '--onyx-shell-activity-bar-inactive-fg',
  shellStatusBarBg: '--onyx-shell-status-bar-bg',
  shellStatusBarFg: '--onyx-shell-status-bar-fg',
  shellTabsBg: '--onyx-shell-tabs-bg',
  shellTabsBorder: '--onyx-shell-tabs-border',
  shellToolbarBg: '--onyx-shell-toolbar-bg',
  shellToolbarBorder: '--onyx-shell-toolbar-border',
  shellBadgeBg: '--onyx-shell-badge-bg',
  shellBadgeFg: '--onyx-shell-badge-fg',
  shellScrollbarThumb: '--onyx-shell-scrollbar-thumb',
  radiusSm: '--onyx-radius-sm',
  radiusMd: '--onyx-radius-md',
  radiusLg: '--onyx-radius-lg',
  shadowSm: '--onyx-shadow-sm',
  shadowMd: '--onyx-shadow-md',
  shadowLg: '--onyx-shadow-lg',
  zPopover: '--onyx-z-popover',
  zDialog: '--onyx-z-dialog',
  zOverlay: '--onyx-z-overlay',
  uiScale: '--onyx-scale-ui',
  typographyScale: '--onyx-scale-type',
  fontFamily: '--onyx-font-family',
  fontSize: '--onyx-font-size'
} as const;

export type OnyxThemeToken = keyof typeof ONYX_THEME_VARIABLES;
export type OnyxThemeVariables = Partial<Record<OnyxThemeToken, string>>;

export const ONYX_DEFAULT_THEME: Record<OnyxThemeToken, string> = {
  surfaceApp: '#111827',
  surfaceEditor: '#0f172a',
  surfacePanel: '#172033',
  surfaceSidebar: '#121a2a',
  surfaceMenu: '#172033',
  surfaceDialog: '#172033',
  surfaceOverlay: 'rgba(6, 11, 23, 0.72)',
  textForeground: '#e5ecf5',
  textMuted: '#bcc8d8',
  textDescription: '#92a1b5',
  textLink: '#7dc4ff',
  textInverse: '#09111f',
  controlButtonBg: '#2b5fd9',
  controlButtonFg: '#f8fbff',
  controlButtonHoverBg: '#3970f2',
  controlSecondaryBg: '#22304b',
  controlSecondaryFg: '#dce6f5',
  controlSecondaryHoverBg: '#304262',
  controlDestructiveBg: '#b94b4b',
  controlDestructiveFg: '#fff4f4',
  controlInputBg: '#0f172a',
  controlInputFg: '#e5ecf5',
  controlInputBorder: '#31415f',
  controlFocusRing: '#7dc4ff',
  stateHover: 'rgba(125, 196, 255, 0.14)',
  stateActive: 'rgba(125, 196, 255, 0.24)',
  stateSelected: '#244a8f',
  stateDisabled: 'rgba(180, 190, 205, 0.38)',
  stateWarning: '#d9a43b',
  stateError: '#f26a6a',
  stateSuccess: '#51b37a',
  shellActivityBarBg: '#0d1422',
  shellActivityBarFg: '#f5f9ff',
  shellActivityBarInactiveFg: 'rgba(245, 249, 255, 0.62)',
  shellStatusBarBg: '#0b4fbf',
  shellStatusBarFg: '#f5f9ff',
  shellTabsBg: '#0f172a',
  shellTabsBorder: '#31415f',
  shellToolbarBg: '#121a2a',
  shellToolbarBorder: '#31415f',
  shellBadgeBg: '#2b5fd9',
  shellBadgeFg: '#ffffff',
  shellScrollbarThumb: 'rgba(125, 196, 255, 0.3)',
  radiusSm: '0.375rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  shadowSm: '0 4px 14px rgba(2, 6, 23, 0.24)',
  shadowMd: '0 18px 40px rgba(2, 6, 23, 0.36)',
  shadowLg: '0 24px 56px rgba(2, 6, 23, 0.48)',
  zPopover: '300000',
  zDialog: '300001',
  zOverlay: '299999',
  uiScale: '1',
  typographyScale: '1',
  fontFamily: "var(--theme-font-family, 'Segoe UI'), system-ui, sans-serif",
  fontSize: '13px'
};

export function mergeOnyxThemeVariables(...sources: OnyxThemeVariables[]): OnyxThemeVariables {
  return Object.assign({}, ...sources);
}

export function createOnyxThemeStyleMap(
  variables: OnyxThemeVariables = {}
): Record<string, string> {
  const merged = {
    ...ONYX_DEFAULT_THEME,
    ...variables
  };

  return Object.fromEntries(
    Object.entries(ONYX_THEME_VARIABLES).map(([token, cssVariableName]) => [
      cssVariableName,
      merged[token as OnyxThemeToken]
    ])
  );
}
