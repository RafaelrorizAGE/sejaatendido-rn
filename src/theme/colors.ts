/**
 * Seja Atendido – Design Tokens
 * Centralised palette used across every screen.
 */

const Colors = {
  /* ── brand ─────────────────────────────── */
  primary:      '#FF1744',   // logo red
  primaryDark:  '#D50032',
  primaryLight: '#FF5252',
  accent:       '#FFE4EA',   // selection / light highlight bg
  accentSoft:   '#FFF0F3',   // very subtle tint

  /* ── backgrounds ───────────────────────── */
  bg:           '#F7F8FC',
  card:         '#FFFFFF',
  inputBg:      '#F2F3F7',

  /* ── text ──────────────────────────────── */
  textPrimary:   '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  /* ── borders ───────────────────────────── */
  border:       '#E8ECF0',
  borderLight:  '#F0F1F5',

  /* ── semantic ──────────────────────────── */
  success:      '#00C853',
  successLight: '#E8F5E9',
  warning:      '#FF9800',
  warningLight: '#FFF3E0',
  error:        '#FF1744',
  errorLight:   '#FFEBEE',

  /* ── role accents (dashboards) ─────────── */
  doctor:       '#00897B',
  doctorLight:  '#E0F2F1',
  admin:        '#7C4DFF',
  adminLight:   '#EDE7F6',

  /* ── misc ──────────────────────────────── */
  shadow:       '#000',
  overlay:      'rgba(0,0,0,0.05)',
} as const;

export default Colors;
