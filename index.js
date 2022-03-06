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
        personArray : [],

        getAll() {
            return this.personArray
        },

        includePerson(Person) {
            if (!Array.isArray(Person.interests) || typeof Person.name !== "string"
                || typeof Person.email !== "string" || !Person.freeRange.startDate instanceof Date
                || !Person.freeRange.endDate instanceof Date) return false
            if (Person.interests.find(interest => interest === this.interest)
                && !this.personArray.find(elem => elem === Person)) {
                this.personArray.push(Person)
                return true
            } else return false
        },

        excludePerson(email) {
            const found = this.personArray.find(elem => elem.email === email && typeof email === "string");
            if (found) {
                this.personArray.splice(this.personArray.indexOf(found), 1);
                return true
            } else return false;
        }
    }
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (group.hasOwnProperty('getAll') && meetingDate instanceof Date)
        return group.personArray.filter(elem => elem.freeRange.startDate <= meetingDate &&
            elem.freeRange.endDate >= meetingDate).length
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
    const min = startArr.sort((a,b) => a-b)[0]
    const max = endArr.sort((a,b) => a-b)[endArr.length-1];
    let max_length = 1;
    for (let date = min;date < max;date.setDate(date.getDate() + 1)) {
        if (findMeetingMembers(group,date) > max_length) {
            max_length = findMeetingMembers(group,date);
            resultDate = new Date(date);
        }
    }
    return resultDate;
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
