export function register() {
  if (typeof window === 'undefined') {
    // Node.js 25+ exposes a broken localStorage global when --localstorage-file
    // is passed without a valid path. The object exists but getItem is not a
    // function, which crashes Next.js dev overlay checks at render time.
    if (
      typeof localStorage !== 'undefined' &&
      typeof localStorage.getItem !== 'function'
    ) {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          length: 0,
          key: () => null,
        },
        writable: true,
        configurable: true,
      });
    }
  }
}
