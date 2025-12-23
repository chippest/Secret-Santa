
export interface UserPreferences {
  favoriteActivity: string;
  favoriteFlavor: string;
  holidayVibe: string;
  wish: string;
  ornamentShape: 'circle' | 'star' | 'gingerbread';
  ornamentColor: string;
}

export interface OrnamentMessage {
  id: number;
  message: string;
}

export enum AppStage {
  START = 'START',
  QUIZ = 'QUIZ',
  GROWING = 'GROWING',
  TREE = 'TREE'
}
