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
  const intrst = interest;
  const userList = [];
  return {
    getAll: function () {
      return userList;
    },
    includePerson: function (user) {
      if (user.interests === undefined)
        return false;
      if (checkUser(user, intrst) && !userList.includes(user)) {
        userList.push(user);
        return true;
      }
      return false;
    },
    excludePerson: function (email) {
      for (let i = 0; i < userList.length; i++) {
        if (userList[i].email === email) {
          userList.splice(i, 1);
          return true;
        }
      }
      return false;
    },
  };
}

function checkUser(user, interest) {
  for (let i = 0; i < user.interests.length; i++) {
    if (user.interests[i] === interest) return true;
  }
  return false;
}

function checkDate(date, range) {
  return range.freeRange.startDate <= date && date <= range.freeRange.endDate;
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
  let count = 0;
  let check =!group instanceof Object || 
  group === undefined ||
  !group.hasOwnProperty("getAll") ||
  !typeof group.getAll == 'function'||
  !(meetingDate instanceof Date);
  
  if (check)
    return 0;
  const localList = group.getAll();
  for (let i = 0; i < localList.length; i++) {
    if (checkDate(meetingDate, localList[i])) count++;
  }
  return count;
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
  let check = !group instanceof Object || 
  group === undefined ||
  !group.hasOwnProperty("getAll");

  if (check)
    return null;
  let count = 0;
  let start = null;

  const startDates = group.getAll().map((x) => x.freeRange.startDate);

  startDates.forEach((date) => {
    const userCount = findMeetingMembers(group, date);

    if (userCount > count) {
      count = userCount;
      start = date;
    }
  });
  return start;
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers, };
