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
  const persons = [];

  return {
    getAll: () => persons,

    includePerson: (person) => {
      if (
        person.interests?.includes(interest)
        && persons.every(({ email }) => email !== person.email)
      ) {
        persons.push(person);
        return true;
      }
      return false;
    },

    excludePerson: (email) => {
      const index = persons.findIndex(person => person.email === email);
      if (index === -1) {
        return false;
      }
      persons.splice(index, 1);
      return true;
    },
  };
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
  const groupArray = group.getAll && group.getAll();
  if (!groupArray || !(meetingDate instanceof Date)) {
    return 0;
  }

  return groupArray.reduce((sum, { freeRange: { startDate, endDate } }) => {
    if (startDate <= meetingDate && endDate >= meetingDate) {
      return sum += 1;
    }
    return sum;
  }, 0);
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
  const groupArray = group.getAll && group.getAll();
  if (!groupArray) {
    return null;
  }

  const datesToCheck = groupArray
    .reduce(
      (dates, { freeRange: { startDate, endDate } }) => [ ...dates, startDate, endDate ],
      [],
    ).sort((date1, date2) => date1 - date2);

  let result;
  let datesArray = [];
  for (const date of datesToCheck) {
    const personsCount = findMeetingMembers(group, date);
    if (personsCount === groupArray.length) {
      result = date;
      break;
    }
    if (personsCount > 1) {
      datesArray.push({ date, personsCount });
    }
  }
  return result
    ?? datesArray
      .sort((date1, date2) => date2.personsCount - date1.personsCount)[0]
      ?.date
    ?? null;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
