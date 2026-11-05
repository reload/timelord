import { seedrandom } from './vendor.js';

// How often the employee of the week also gets a moustache.
const MOUSTACHE_CHANCE = 0.2;

// Week number of a date, counted from 1 January.
export function getWeek(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

// Pick the employee of the week for the week of endDate. The choice is seeded
// by the week, so everyone sees the same winner.
export function pickEmployeeOfWeek(users, endDate) {
  const names = (users || []).map((user) => user.full_name).sort();
  if (!names.length) {
    return null;
  }
  // Use a local generator rather than replacing Math.random.
  const rng = new seedrandom(`${endDate.getFullYear()}-W${getWeek(endDate)}`);
  return {
    name: names[Math.floor(rng() * names.length)],
    moustache: rng() < MOUSTACHE_CHANCE,
  };
}
