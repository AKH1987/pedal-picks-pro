// Vitest + Testing Library setup
import '@testing-library/jest-dom/vitest';

// Optionally, extend more globals or mocks here if needed
// Example: mock matchMedia for components using it
// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: (query: string) => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: () => {},
//     removeListener: () => {},
//     addEventListener: () => {},
//     removeEventListener: () => {},
//     dispatchEvent: () => false,
//   }),
// });
