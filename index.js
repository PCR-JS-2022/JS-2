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
const checkGroupValidity = (group) => {
    if (!group || !group.getAll || !group.includePerson || !group.excludePerson)
        return false;
    else return true;
};
const isDateInRange = (startInterval, endInterval, people) => {
    const allStartDates = people
        .flatMap((person) => person.freeRange.startDate)
        .sort((a, b) => a.getTime() - b.getTime());
    const allDatesInInterval = allStartDates.every(
        (date) =>
            date.getTime() >= startInterval.getTime() &&
            date.getTime() <= endInterval.getTime()
    );
    return allDatesInInterval
        ? allStartDates[allStartDates.length - 1]
        : allStartDates[allStartDates.length - 2];
};
function createGroup(interest) {
    const people = [];
    return {
        people,
        getAll: () => people,
        includePerson: (person) => {
            if (
                person.interests === undefined ||
                people.some((friend) => friend.email === person.email) ||
                !person.interests.some((x) => x === interest)
            ) {
                return false;
            }
            const personExists = people.some(
                (friend) => friend.email === person.email
            );
            if (person.interests.includes(interest) && !personExists) {
                people.push(person);
                return true;
            } else return false;
        },
        excludePerson: (email) => {
            const friendIndex = people.findIndex((friend) => friend.email === email);
            if (friendIndex !== -1) {
                people.splice(friendIndex, 1);
                return true;
            } else return false;
        },
    };
}
const javascriptGroup = createGroup("javascript");
javascriptGroup.includePerson(phoneList[3]);
/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
    let result = [];
    const arugmentsInvalid =
        meetingDate instanceof Date === false ||
        typeof group !== "object" ||
        !group.getAll;
    if (arugmentsInvalid) {
        return 0;
    }
    const people = group.getAll();
    people.forEach((person) => {
        if (
            meetingDate.getTime() >= person.freeRange.startDate.getTime() &&
            meetingDate.getTime() <= person.freeRange.endDate.getTime()
        ) {
            result.push(person);
        }
    });
    return result.length;
}
/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */

function findMeetingDateWithMaximumMembers(group) {
    let result = [];
    let resultEnd = [];
    if (!checkGroupValidity(group)) return null;
    const people = group.getAll();
    people.forEach((person) => {
        result.push(person.freeRange.startDate);
        resultEnd.push(person.freeRange.endDate);
    });
    const resultStartSorted = result.sort((a, b) => a.getTime() - b.getTime());
    const resultEndSorted = resultEnd.sort((a, b) => a.getTime() - b.getTime());
    const maxStartInterval = resultStartSorted[0];
    const maxEndInterval = resultEndSorted[0];
    return isDateInRange(maxStartInterval, maxEndInterval, people);
}
const gamesGroup = createGroup("games");
gamesGroup.includePerson(phoneList[1]);
gamesGroup.includePerson(phoneList[0]);
gamesGroup.includePerson(phoneList[2]);
gamesGroup.includePerson(phoneList[phoneList.length - 1]);
module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers,
};
