import { Chart } from './vendor.js';

const SIZE = '225px';

// Draw a doughnut chart on the canvas with the given id.
export function doughnut(id, data, options = null) {
  // The old chart hangs on to its canvas even when given new data, so replace
  // the canvas to completely reset it.
  const canvas = document.createElement('canvas');
  canvas.id = id;
  document.getElementById(id).replaceWith(canvas);

  // Force the size on every init, as the size otherwise doubles on retina
  // displays every time a new chart is created.
  canvas.setAttribute('width', SIZE);
  canvas.setAttribute('height', SIZE);

  return new Chart(canvas.getContext('2d')).Doughnut(data, options);
}
