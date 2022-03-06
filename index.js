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
    const friendsGroup = [];
    return {
        getAll() {
            return friendsGroup;
        },
        includePerson(friend) {
            if(friend.interests === undefined) return false;
            if(friend.interests.includes(interest)) {
                if(friendsGroup.indexOf(friend) === -1) {
                    friendsGroup.push(friend);
                    return true;
                } else {
                    return false;
                }
            } 
            return false;
        },
        excludePerson(email) {
            let result = false;
            friendsGroup.forEach(friend => {
                if(friendsGroup.includes(friend) && friend.email === email) {
                    friendsGroup.splice(friendsGroup.indexOf(friend), 1);
                    result = true;
                }
            });
            return result;
        }
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if(!(group.getAll || meetingDate instanceof Date)) return 0;
    const friendsGroup = group.getAll();
    meetingDate = meetingDate.getTime();
    return friendsGroup.reduce((count, current) => {
        const startDate = current.freeRange.startDate.getTime();
        const endDate = current.freeRange.endDate.getTime();
        if(meetingDate >= startDate && meetingDate <= endDate) {
            count++;
        }
        return count;
    }, 0)
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */

function findIndexMax(arr) {
    let max = arr[0];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] > max) max = arr[i];
    }
    return arr.indexOf(max);
};

function findMeetingDateWithMaximumMembers(group) {
    if(!group.getAll) return null;

    const friendsGroup = group.getAll();

    const dates = friendsGroup.reduce((res, current) => { //собрали все даты
        res.push(current.freeRange.startDate);
        res.push(current.freeRange.endDate);
        return res;
    }, []);
    const sortedDates = dates.sort((a, b) => {
        return a - b;
    })
    const counts = sortedDates.map(i => findMeetingMembers(group, i));
    const maxCountIndex = findIndexMax(counts);
    return sortedDates[maxCountIndex];
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
