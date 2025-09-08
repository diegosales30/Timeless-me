
export type Decade = '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s';

export enum AppState {
  INITIAL,
  IMAGE_SELECTED,
  GENERATING,
  RESULT,
  ERROR,
}
