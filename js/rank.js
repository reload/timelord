const RANKS = {
  karmahunter: {
    class: 'a-karmahunter',
    icon: '★',
    text: "I've heard that hard work never killed anyone, but I say why take the chance?",
  },
  goalie: {
    class: 'b-goalie',
    icon: '✓',
    text: 'There is no pleasure in having nothing to do; the fun is having lots to do and not doing it.',
  },
  karmauser: {
    class: 'c-karmauser',
    icon: '☂',
    text: 'I always arrive late at the office, but I make up for it by leaving early.',
  },
  slacker: {
    class: 'd-slacker',
    icon: '☁',
    text: 'I like work: it fascinates me. I can sit and look at it for hours.',
  },
};

// Rank a user by how far they are over or under their goal.
export function rankUser(user, workingDaysInRange) {
  // The average amount of hours per day a person is over/under the goal.
  // 30 min overtime per day = 0.5, 2 hours short per day = -2.
  const totalDiff = user.hours_registered - user.hours_goal;
  const avgDiff = totalDiff / workingDaysInRange;

  let rank;
  // More than 30 min extra per day OR 12 hours in total.
  if (avgDiff >= 0.5 || totalDiff > 12) {
    rank = RANKS.karmahunter;
  }
  // Between +29 min and -15 min per day, but no less than -16 hours in total.
  else if (avgDiff < 0.5 && avgDiff > -0.25 && totalDiff > -16) {
    rank = RANKS.goalie;
  }
  // Between 0 and -60 min per day, but no less than -30 hours in total.
  else if (avgDiff <= 0 && avgDiff >= -1 && totalDiff > -30) {
    rank = RANKS.karmauser;
  }
  else {
    rank = RANKS.slacker;
  }

  return {
    ...rank,
    value: avgDiff,
    diff: parseFloat(totalDiff).toFixed(2),
  };
}
