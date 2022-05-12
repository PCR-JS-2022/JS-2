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
    //const interestGroup = interest;
    const group = new Map();

    const getAll = () => Array.from(group.values());

    const includePerson = (person) => {
        if (person?.interests?.includes(interest) && !group.has(person.email)) {
            group.set(person.email, person);
            return true;
        }
        return false;
    }
    const excludePerson = (email) => group.delete(email);

    return {
        getAll: getAll,
        includePerson: includePerson,
        excludePerson: excludePerson
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!meetingDate instanceof Date || !group.getAll) return 0;
    return group.getAll().map(person => person.freeRange)
        .reduce((count, freeRange) =>
            freeRange.startDate <= meetingDate && freeRange.endDate >= meetingDate ? count + 1 : count
        , 0)
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!group.getAll) {
        return null;
    }
    return group.getAll()
        .map(person => person.freeRange)
        .reduce((count, freeRange) => {
            const currentCount = findMeetingMembers(group, freeRange.startDate);
            return currentCount > count.bestCount ? { bestCount: currentCount, bestDate: freeRange.startDate} : count;
        }, { bestDate: null, bestCount: 0 })
        .bestDate;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
