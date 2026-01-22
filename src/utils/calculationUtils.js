/**
 * NDIS Support Rates (Approximate - should be configurable in a real app)
 */
export const RATES = {
    WEEKDAY_DAY: 65.47,
    WEEKDAY_EVENING: 72.13,
    WEEKDAY_NIGHT: 73.46,
    SATURDAY: 92.12,
    SUNDAY: 118.78,
    PUBLIC_HOLIDAY: 145.44,
};

/**
 * Recurrence multipliers for weekly planning
 */
export const RECURRENCE_MULTIPLIERS = {
    DAILY: 7,
    WEEKLY: 1,
    FORTNIGHTLY: 0.5,
    MONTHLY: 0.23, // ~4.33 weeks in a month
    QUARTERLY: 0.077, // ~13 weeks in a quarter
};

/**
 * Calculate total weekly cost for a set of shifts
 * @param {Array} shifts - Array of shift objects { rate, hours, recurrence }
 * @returns {number} Weekly cost
 */
export const calculateWeeklyCost = (shifts) => {
    return shifts.reduce((total, shift) => {
        const rate = RATES[shift.rateType] || RATES.WEEKDAY_DAY;
        const weeklyAdjustment = RECURRENCE_MULTIPLIERS[shift.recurrence] || 1;
        return total + (rate * shift.hours * weeklyAdjustment);
    }, 0);
};

/**
 * Calculate total plan cost for a duration (in weeks)
 * @param {number} weeklyCost 
 * @param {number} durationWeeks 
 * @returns {number} Total cost
 */
export const calculateTotalPlanCost = (weeklyCost, durationWeeks = 52) => {
    return weeklyCost * durationWeeks;
};

/**
 * Calculate available hours per week for a given budget and preferred rate
 * @param {number} budget - Total plan budget
 * @param {string} rateType - Key from RATES
 * @param {number} durationWeeks 
 * @returns {number} Hours per week
 */
export const calculateHoursFromBudget = (budget, rateType = 'WEEKDAY_DAY', durationWeeks = 52) => {
    const rate = RATES[rateType] || RATES.WEEKDAY_DAY;
    const totalHours = budget / rate;
    return totalHours / durationWeeks;
};
