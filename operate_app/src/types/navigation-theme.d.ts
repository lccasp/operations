/**
 * React Navigation 主题类型扩展
 */

declare module '@react-navigation/native' {
  export interface Theme {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  }
}
