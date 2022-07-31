const lightTheme = {
  typography: {
    fontFamily: '-apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif, "Roboto", Arial',
  },
  palette: {
    mode: 'light',
  },
};

const darkTheme = {
  ...lightTheme,
  palette: {
    mode: 'dark',
  },
};

export { lightTheme, darkTheme }