import { seedrandom } from './vendor.js';

// How often the employee of the week also gets a moustache.
const MOUSTACHE_CHANCE = 0.2;

// Week number of a date, counting Sunday-to-Saturday weeks from 1 January.
//
// This isn't an ISO 8601 week number: those start on Monday, and 1 January
// can be in week 52 or 53 of the previous year. As the number is only used to
// seed the pick and is never shown, that means the employee of the week
// changes on Sundays, and also on 1 January if that's mid-week.
//
// Temporal.PlainDate's weekOfYear and yearOfWeek give the ISO week and its
// year. Switch to those once Safari supports Temporal.
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
