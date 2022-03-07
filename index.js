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
            const findInterest = person.interests.includes(this.interest);
            //const findEmail = this.friends.find((friend) => friend.email === person.email);
            const findEmail = this.friends.email.includes(person.email);
            if (findInterest && !findEmail) {
                this.friends.push(person);
                return true;
            }
            return false;
        },
        excludePerson: function (email) {
            if (typeof email !== 'string') return false;
            const tempFriendsCount = this.getAll().length;
            this.friends = this.friends.filter(person => person.email !== email);
            return tempFriendsCount !== this.friends.length;
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
    group.getAll().forEach((person) => {
        if (Number(meetingDate) >= Number(person.freeRange.startDate) && Number(meetingDate) <= Number(person.freeRange.endDate)) {
            personCount++;
        }
    })
    return personCount;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!isGroup(group) || group.getAll().length === 0)
        return null;
    const dateArr = group.getAll().map((person) => [person.freeRange.startDate, 0]);
    const resultArr = dateArr.map((date) => [date[0], findMeetingMembers(group, date[0])]);
    /*    for (let date of dateArr) {
            for (let person of group.getAll()) {
                date[1] = findMeetingMembers(group, date[0]);
            }
        }*/
    resultArr.sort((a, b) => b[1] - a[1]);
    const answerDate = resultArr[0];
    if (answerDate[1] === 0) return null;
    return answerDate[0];
};

module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers
};
