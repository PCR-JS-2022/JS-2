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
  const getAll = () => members;
  
  function onMember(person) {
    if (person.interests?.includes(interest) && 
    !people.map((p) => p.email).includes(person.email))
    {
        people.push(person);
        return true;
    }
    return false;
}

  function offMember(email) {
    const memberIndex = members.findIndex((x) => x.email === email);
    if (memberIndex === -1) return false;
    members = members.filter((x) => x.email !== email);
    return true;
    }

  return { getAll, onMember, offMember };
}

function testRange(tempDate, range) {
  return tempDate >= range.startDate && tempDate <= range.endDate;
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
  const members = group.getAll() && group.getAll();
  if (members.length === 0) return null;
  if (members.length === 1) return members[0].freeRange.startDate;

  const dates = members.map((x) => x.freeRange.startDate);
  let resultDate = startDates.sort((a, b) => a - b)[0];
  let maxPeople = 0;
  dates.forEach((date) => {const counter = members
    .filter((person) => isInRange(date, person.freeRange))
    .length;
    
    if (counter > maxPeople) {
      maxPeople = counter;
      resultDate = date;
    } });
  return resultDate;
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
