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
    let groupMembers = [];
    const groupInterest = interest;
    const group = {
        getAll: () => groupMembers,
        includePerson: (person) => {
            if (!person 
                || !Array.isArray(person.interests)
                || groupMembers.includes(person) 
                || !person.interests.includes(groupInterest)) {
                return false;
            }

            groupMembers.push(person);
            return true;
        },
        excludePerson: (personEmail) => {
            if (!personEmail) {
                return false;
            }

            const groupMembersLength = groupMembers.length;
            groupMembers = groupMembers.filter(member => member.email !== personEmail);
            return groupMembersLength !== groupMembers.length;
        }
    }

    return group;
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!group || typeof group !== 'object' || typeof group.getAll !== 'function') {
        return 0;
    }

    if (!meetingDate || !(meetingDate instanceof Date) || isNaN(meetingDate.valueOf())) {
        return 0;
    }

    return group.getAll().reduce((totalCount, {freeRange}) => {
        if (!freeRange) {
            return totalCount;
        }

        if (freeRange.startDate <= meetingDate && freeRange.endDate >= meetingDate) {
            return ++totalCount;
        }

    }, 0) || 0;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!group || typeof group !== 'object' || typeof group.getAll !== 'function') {
        return null;
    }

    const members = group.getAll();
    let result = null;
    let maxMembers = 0;

    members.forEach(member => {
        const memberStartDate = member.freeRange.startDate;
        const membersInRange = members.filter(m => {
            return m.freeRange.startDate <= memberStartDate && memberStartDate <= m.freeRange.endDate;
        });

        if (membersInRange.length > maxMembers) {
            result = memberStartDate;
            maxMembers = membersInRange.length;
        }
        
        if (membersInRange.length === maxMembers && memberStartDate < result) {
            result = memberStartDate;
        }
    });

    return result;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
