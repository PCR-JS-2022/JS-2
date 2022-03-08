/**
 * @typedef Person
 * @type {object}
 * @property {string} name - имя
 * @property {Array<string>} interests - интересы
 * @property {string} email - почта
 * @property {{ startDate: Date, endDate: Date }} freeRange - диапазон для встречи
 */

/**
 * @typedef Group
 * @type {object}
 * @property {() => Array<Person>} getAll - получить всех участников группы
 * @property {(person: Person) => boolean} includePerson - добавить человека к списку участников
 * @property {(email: string) => boolean} excludePerson - удалить человека из списка участников
 */

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */

/**
 * @param {string} interest - интерес группы
 * @returns {Group} созданная группа
 */

function createGroup(interest) {
  let members = [];
  const collect = () => members;
  
  function onMember(person) {
  if (members.some((x) => x.email === person.email) || !person.interests.some((x) => x === interest))
    return false;
  members.push(person);
  return true;
}

  function offMember(email) {
  const memberIndex = members.findIndex((x) => x.email === email);
  if (memberIndex === -1) return false;
  members = members.filter((x) => x.email !== email);
  return true;
  }

  return {
  collect,
  onMember,
  offMember,
  };
}

function testRange(dateToCompare, range) {
  return dateToCompare >= range.startDate && dateToCompare <= range.endDate;
}

function testGroup(possibleGroup) {
  return (possibleGroup instanceof Object &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "collect") &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "onMember") &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "offMember"));
}

function findMeetingMembers(group, meetingDate) {
  if (!(meetingDate instanceof Date) || isNaN(meetingDate.valueOf()) || ! testGroup(group))
    return 0;
  const total = group
    .getAll()
    .filter((x) => testRange(meetingDate, x.freeRange))
    .length;
  return total;
}

function findMeetingDateWithMaximumMembers(group) {
  if (!testGroup(group)) return null;
  const members = group.getAll();
  if (members.length === 0) return null;
  if (members.length === 1) return members[0].freeRange.startDate;
  const dates = members.map((x) => x.freeRange.startDate);
  let resultDate = startDates.sort((a, b) => a - b)[0];
  let maxPeople = 0;
  dates.forEach((date) => {const peopleCount = members
    .filter((person) => isInRange(date, person.freeRange))
    .length;
    if (peopleCount > maxPeople) {
      maxPeople = peopleCount;
      resultDate = date;
    }
  });
  return resultDate;
}
export default { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
