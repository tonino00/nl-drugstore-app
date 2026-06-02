import 'styled-components';
import type { theme as themeObject } from './theme';

type Theme = typeof themeObject;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
