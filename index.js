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
    const group = [];
    return {
        getAll() {
            return group;
        },
        includePerson(person) {
            if (!person.interests) return false
            const isMember = group.indexOf(person) > -1;
            const hasInterest = person.interests.includes(interest);
            if (group.length > 0 && (isMember || !hasInterest)) return false;
            else {
                group.push(person);
                return true;
            }
        },
        excludePerson(mail) {
            const index = group.indexOf(group.find(member => member.email === mail));
            if (index !== -1) {
                group.splice(index, 1);
                return true;
            } else return false
        }
    }
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */

function findMeetingMembers(group, meetingDate) {
    if (!group.getAll || !meetingDate instanceof Date) return 0;
    return group
        .getAll()
        .filter(member => isMemberCanMeet(member, meetingDate)).length
}

function isMemberCanMeet(member, meetingDate) {
    const startDate = new Date(member.freeRange.startDate);
    const endDate = new Date(member.freeRange.endDate);
    return (meetingDate >= startDate && meetingDate <= endDate);
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!group.getAll) return null;
    let bestDate = null;
    let bestMembersCount = 0;
    group.getAll()
        .map(member => member.freeRange.startDate)
        .forEach(date => {
            let membersCount = findMeetingMembers(group, date);
            if (membersCount > bestMembersCount) {
                bestDate = date;
                bestMembersCount = membersCount;
            }
        })
    return bestDate;
}

module.exports = {createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers};
