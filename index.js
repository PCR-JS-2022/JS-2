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
    return {
        interest: interest,
        friends: [],
        getAll: function () {
            return this.friends;
        },
        includePerson: function (person) {
            if (!isPerson(person)) return false;
            if ((person.interests.find((interest) => interest === this.interest) !== undefined)
                && this.friends.find((friend) => friend.email === person.email) === undefined) {
                this.friends.push(person);
                return true;
            }
            return false;
        },
        excludePerson: function (email) {
            if (typeof email !== 'string') return false;
            let person = this.friends.findIndex((friend) => friend.email === email);
            if (person !== -1) {
                this.friends.splice(person, 1);
                return true;
            }
            return false;
        }
    };
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
    if (!isGroup(group) || !meetingDate instanceof Date || isNaN(+meetingDate))
        return 0;
    let personCount = 0;
    for (let person of group.getAll()) {
        if (+meetingDate >= +person.freeRange.startDate && +meetingDate <= +person.freeRange.endDate)
            personCount++;
    }
    return personCount;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!isGroup(group) || group.getAll().length === 0)
        return null;
    let dateArr = group.getAll().map((person) => [person.freeRange.startDate, 0]);
    for (let date of dateArr) {
        for (let person of group.getAll()) {
            date[1] = findMeetingMembers(group, date[0]);
        }
    }
    dateArr.sort((a, b) => b[1] - a[1]);
    if (dateArr[0][1] === 0)
        return null;
    return dateArr[0][0];
};

/**
 * Check, is variable object with type "Group" or not
 * @param {Group} group
 * @returns {boolean}
 */
function isGroup(group) {
    return (typeof group === 'object')
        && (group.hasOwnProperty('getAll'))
        && (group.hasOwnProperty('includePerson'))
        && (group.hasOwnProperty('excludePerson'));
}

/**
 * Check, is variable object with type "Person" or not
 * @param {Person} person
 * @returns {boolean}
 */
function isPerson(person) {
    return (typeof person === 'object')
        && (person.hasOwnProperty('name') && typeof person.name === 'string')
        && (person.hasOwnProperty('interests') && Array.isArray(person.interests))
        && (person.hasOwnProperty('email') && typeof person.email === 'string')
        && (person.hasOwnProperty('freeRange') && typeof person.freeRange === 'object');
}

module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers
};
