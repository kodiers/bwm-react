export const required = value => (value ? undefined : 'This input is required');

const minLength = min => value => value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const minLenght4 = minLength(4);
