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
 * @param {string} interest - интерес группы
 * @returns {Group} созданная группа
 */
function createGroup(interest) {
  let members = [];

  const getAll = () => members;

  /**
   * @param {Person} person
   * @returns {boolean}
   */
  function includePerson(person) {
    if (
      person.interests === undefined ||
      members.some((x) => x.email === person.email) ||
      !person.interests.some((x) => x === interest)
    )
      return false;

    members.push(person);
    return true;
  }

  function excludePerson(email) {
    const memberIndex = members.findIndex((x) => x.email === email);

    if (memberIndex === -1) return false;

    members = members.filter((x) => x.email !== email);
    return true;
  }

  return {
    getAll: getAll,
    includePerson: includePerson,
    excludePerson: excludePerson,
  };
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
  if (
    !(meetingDate instanceof Date) ||
    isNaN(meetingDate.valueOf()) ||
    !isGroup(group)
  )
    return 0;

  const peopleAmount = group
    .getAll()
    .filter((x) => isInRange(meetingDate, x.freeRange)).length;

  return peopleAmount;
}

/**
 *
 * @param {Date} dateToCompare
 * @param {{ startDate: Date, endDate: Date }} range
 * @returns {boolean}
 */
function isInRange(dateToCompare, range) {
  return dateToCompare >= range.startDate && dateToCompare <= range.endDate;
}

/**
 *
 * @param {Group} possibleGroup
 * @returns {boolean}
 */
function isGroup(possibleGroup) {
  return (
    possibleGroup instanceof Object &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "getAll") &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "includePerson") &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "excludePerson")
  );
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
  if (!isGroup(group)) return null;

  const members = group.getAll();

  if (members.length === 0) return null;

  if (members.length === 1) return members[0].freeRange.startDate;

  const startDates = members.map((x) => x.freeRange.startDate);

  let bestDate = new Date("01.01.2000");
  let maximumPeople = 0;
  startDates.forEach((date) => {
    const peopleCount = members.filter((person) =>
      isInRange(date, person.freeRange)
    ).length;

    if (peopleCount > maximumPeople) {
      maximumPeople = peopleCount;
      bestDate = date;
    }
  });

  return bestDate;
}

module.exports = {
  createGroup,
  findMeetingMembers,
  findMeetingDateWithMaximumMembers,
};
