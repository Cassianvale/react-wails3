import { ConfigProvider, theme } from 'antd';
import { createContext, useState, useEffect } from 'react';
import Dashboard from './components/dashboard';
import TitleBar from './components/TitleBar';

export type ThemeMode = 'system' | 'dark' | 'light';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
});

// 全局样式变量
const TITLE_BAR_HEIGHT = '32px';

const App = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  // 监听系统主题变化
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode]);

  const themeConfig = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      borderRadius: 6,
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
        <style>
          {`
            :root {
              --title-bar-height: ${TITLE_BAR_HEIGHT};
            }
          `}
        </style>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}>
          <TitleBar />
          <div style={{ 
            flex: 1,
            overflow: 'hidden',
            height: `calc(100vh - var(--title-bar-height))`,
          }}>
            <Dashboard />
          </div>
        </div>
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};

export default App;