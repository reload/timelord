// The third-party libraries are still loaded as a classic script bundle
// (vendor.min.js) that sets globals. Re-export them here so the modules
// declare what they depend on.
export const { angular, Chart } = window;

// seedrandom attaches itself to Math rather than window.
export const { seedrandom } = Math;
