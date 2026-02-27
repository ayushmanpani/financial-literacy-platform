export function evaluateEligibility(profile: any, rules: any) {
  if (!profile) return false;

  if (rules.minIncome && profile.income < rules.minIncome) return false;
  if (rules.maxIncome && profile.income > rules.maxIncome) return false;

  if (rules.occupation && profile.occupation !== rules.occupation)
    return false;

  if (rules.location && profile.location !== rules.location)
    return false;

  if (rules.familySize && profile.familySize !== rules.familySize)
    return false;

  return true;
}