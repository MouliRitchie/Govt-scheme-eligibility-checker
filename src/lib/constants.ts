export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
export const GENDERS = ["Male", "Female", "Other"];
export const INCOME_RANGES = ["Below 1L", "1-2.5L", "2.5-5L", "5-10L", "Above 10L"];
export const EDUCATION_LEVELS = ["10th", "12th", "Graduate", "Post Graduate"];
export const EMPLOYMENT_STATUSES = ["Student", "Unemployed", "Self-Employed", "Employed"];
export const SCHEME_CATEGORIES = ["Education", "Health", "Agriculture", "Finance", "Women", "Housing"];

export const CATEGORY_COLORS: Record<string, string> = {
  Education: "cat-education",
  Health: "cat-health",
  Agriculture: "cat-agriculture",
  Finance: "cat-finance",
  Women: "cat-women",
  Housing: "cat-housing",
};

// Income hierarchy for eligibility matching
const INCOME_ORDER = ["Below 1L", "1-2.5L", "2.5-5L", "5-10L", "Above 10L"];
const EDUCATION_ORDER = ["None", "10th", "12th", "Graduate", "Post Graduate"];

export function isIncomeEligible(userIncome: string | null, maxIncome: string | null): boolean {
  if (!maxIncome || maxIncome === 'All') return true;
  if (!userIncome) return false;
  return INCOME_ORDER.indexOf(userIncome) <= INCOME_ORDER.indexOf(maxIncome);
}

export function isEducationEligible(userEdu: string | null, minEdu: string | null): boolean {
  if (!minEdu || minEdu === 'None' || minEdu === 'All') return true;
  if (!userEdu) return false;
  return EDUCATION_ORDER.indexOf(userEdu) >= EDUCATION_ORDER.indexOf(minEdu);
}

export interface Profile {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  state: string | null;
  category: string | null;
  income: string | null;
  education: string | null;
  employment: string | null;
  profile_completed: boolean | null;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  min_age: number | null;
  max_age: number | null;
  max_income: string | null;
  eligible_categories: string[] | null;
  eligible_gender: string | null;
  min_education: string | null;
  employment: string | null;
  documents: string[] | null;
  apply_link: string | null;
  eligible_count: string | null;
  deadline: string | null;
  steps: string[] | null;
}

export interface Exam {
  id: string;
  name: string;
  description: string;
  min_age: number | null;
  max_age: number | null;
  eligible_education: string | null;
  eligible_gender: string | null;
  subject_requirements: string | null;
  documents: string[] | null;
  apply_link: string | null;
  official_link: string | null;
  steps: string[] | null;
}

export function checkSchemeEligibility(profile: Profile, scheme: Scheme): boolean {
  // Age check
  if (scheme.min_age && profile.age && profile.age < scheme.min_age) return false;
  if (scheme.max_age && profile.age && profile.age > scheme.max_age) return false;

  // Gender check
  if (scheme.eligible_gender && scheme.eligible_gender !== 'All' && profile.gender !== scheme.eligible_gender) return false;

  // Category check
  if (scheme.eligible_categories && scheme.eligible_categories.length > 0 && profile.category) {
    if (!scheme.eligible_categories.includes(profile.category)) return false;
  }

  // Income check
  if (!isIncomeEligible(profile.income, scheme.max_income)) return false;

  // Education check
  if (!isEducationEligible(profile.education, scheme.min_education)) return false;

  // Employment check
  if (scheme.employment && scheme.employment !== 'All' && profile.employment !== scheme.employment) return false;

  return true;
}

export function checkExamEligibility(profile: Profile, exam: Exam): boolean {
  if (exam.min_age && profile.age && profile.age < exam.min_age) return false;
  if (exam.max_age && profile.age && profile.age > exam.max_age) return false;
  if (exam.eligible_gender && exam.eligible_gender !== 'All' && profile.gender !== exam.eligible_gender) return false;
  if (!isEducationEligible(profile.education, exam.eligible_education)) return false;
  return true;
}
