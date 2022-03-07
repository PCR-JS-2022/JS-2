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

    function includePerson(person) {
        if (person.interests == undefined ||
            members.some(x => x.email == person.email) ||
            !person.interests.some(x => x == interest))
        return false;
        members.push(person);
        return true;
    };

    function getAll() {
        return members;
    }

    function excludePerson(email) {
        if (members.findIndex(x => x.email == email) < 0)
        return false;

        members = members.filter(x => x.email != email);
        return true;
    }

    return {
        getAll,
        includePerson,
        excludePerson,
      }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!(group instanceof Object && group.hasOwnProperty("getAll") &&
    group.hasOwnProperty("includePreson") && group.hasOwnProperty("excludePerson")) ||
    !meetingDate instanceof Date)
    return 0;
    const friendsToMeet = group.getAll().filter(x => meetingDate >= x.freeRange.startDate &&
        meetingDate <= x.freeRange.endDate);
    return friendsToMeet.length;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!(group instanceof Object && group.hasOwnProperty("getAll") &&
    group.hasOwnProperty("includePreson") && group.hasOwnProperty("excludePerson"))) return null;
    const friends = group.getAll();
    if (friends.length == 0) return null;
    let result = new Date();
    let starts = friends.map(x => x.freeRange.startDate);
    let maxCount = 0;
    starts.forEach(x => {
        const counter = friends.filter(y => x >= y.freeRange.startDate && x <= y.freeRange.endDate).length;
        if (counter > maxCount) {
            maxCount = counter;
            result = x;
        }
    });
    return result;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
