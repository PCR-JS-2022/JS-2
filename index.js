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
    const friends = [];
    
    return {
        getAll: () => {
            return friends;
        },

        includePerson: (friend) => {
            if(friend.interests === undefined) return false;

            if(friends.some(e => e.email === friend.email) 
                || !friend.interests.some(e => interest === e)){
                return false;
            }

            friends.push(friend);
            return true;
        },

        excludePerson: (friendEmail) => {
            const index = friends.findIndex(e => e.email === friendEmail);

            if (index === -1) return false;

            friends.splice(index, 1);
            return true;
        }
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if(!(isGroup(group) || meetingDate instanceof Date)) return 0;

    const friends = group.getAll();
    let count = 0;

    friends.forEach(e => {
        if(e.freeRange.startDate <= meetingDate && e.freeRange.endDate >= meetingDate){
            count++;
        }
    });

    return count;
};

function isGroup(group){
    return group.hasOwnProperty('getAll') 
        && group.hasOwnProperty('includePerson') 
        && group.hasOwnProperty('excludePerson');
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if(!isGroup(group)) return null;

    const friends = group.getAll();
    const dates = friends.map(e => e.freeRange.startDate).sort((a, b) => a - b);

    let max = 1;
    let bestDate;
    dates.forEach(e => {
        let counts = findMeetingMembers(group, e);
        if(counts > max)
        {
            bestDate = e;
            max = counts;
        }
    });

    if(max === 1) return null;

    return bestDate;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
