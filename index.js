/**
 * @typedef person
 * @type {object}
 * @property {string} name - имя
 * @property {Array<string>} interests - интересы
 * @property {string} email - почта
 * @property {{ startDate: Date, endDate: Date }} freeRange - диапазон для встречи
 */

/**
 * @typedef Group
 * @type {object}
 * @property {() => Array<person>} getAll - получить всех участников группы
 * @property {(person: person) => boolean} includePerson - добавить человека к списку участников
 * @property {(email: string) => boolean} excludePerson - удалить человека из списка участников
 */

/**
 * @param {string} interest - интерес группы
 * @returns {Group} созданная группа
 */
function createGroup(interest) {
    return {
        interest: interest,
        personArray : [],

        getAll() {
            return this.personArray
        },

        includePerson(person) {
            if (!this.isValidPerson(person))
                return false;
            if (person.interests.find(interest => interest === this.interest)
                && !this.personArray.find(elem => elem === person)) {
                this.personArray.push(person)
                return true
            } else return false
        },

        excludePerson(email) {
            return this.personArray = this.personArray.filter(elem => elem.email !== email && typeof email === "string");
        },

        isValidPerson(person) {
            return !(!Array.isArray(person.interests) || typeof person.name !== "string"
                || typeof person.email !== "string" || !person.freeRange.startDate instanceof Date
                || !person.freeRange.endDate instanceof Date);
        }
    }
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (group.hasOwnProperty('getAll') && meetingDate instanceof Date) {
        return group.personArray.filter(elem => elem.freeRange.startDate <= meetingDate &&
            elem.freeRange.endDate >= meetingDate).length
    }
    else return 0
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    let resultDate = null;
    if (!group.hasOwnProperty('getAll'))
        return resultDate;
    const startArr = [];
    const endArr = [];
    group.personArray.forEach(elem => {
        startArr.push(elem.freeRange.startDate)
        endArr.push(elem.freeRange.endDate)
    })
    const min = startArr.sort((a, b) => a - b)[0]
    const max = endArr.sort((a, b) => a - b)[endArr.length - 1];
    let maxLength = 1;
    for (let date = min; date < max; date.setDate(date.getDate() + 1)) {
        const currentCount = findMeetingMembers(group, date);
        if (currentCount > maxLength) {
            maxLength = currentCount;
            resultDate = new Date(date);
        }
    }
    return resultDate;
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
