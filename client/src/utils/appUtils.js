import moment from 'moment';
import equals from 'validator/lib/equals';

export const checkDuplicate = (collection, item) => collection.includes(item);

export const getUserInitials = name => {
  const splitName = name.toUpperCase().split(' ');
  const initials = splitName.map(key => `${key.split('').shift()}`);
  return initials;
};

export const emptyFunc = () => {};

export const getFormattedString = string =>
  string
    .trim()
    .replace(' ', '-')
    .toLowerCase();

export const capitalize = string =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const getProgression = (partialValue, totalValue) =>
  (100 * partialValue) / totalValue;

export const getFormattedDate = (date, format, calendar) =>
  calendar ? moment(date).calendar() : moment(date).format(format);

export const compareStrings = (mainString, comparison) => {
  if (typeof comparison !== 'string')
    return comparison.includes(mainString || '');

  return equals(mainString, comparison);
};

export const findArrayItem = (array, itemId, fieldProp) =>
  array.filter((item, index) =>
    fieldProp ? equals(item[fieldProp], itemId) : index === itemId,
  )[0];

export const getUpdatedArray = (array, replaceIndex, newObject) => {
  array.splice(replaceIndex, 1, newObject);
  return array;
};

export const updateObject = (oldObject, propsUpdated) => {
  return {
    ...oldObject,
    ...propsUpdated,
  };
};
