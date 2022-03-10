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
    const participants = [];
    return {
        getAll: () => participants,
        includePerson: (participant) => {
            const participantExists = participants.some(
                (friend) => friend.email === participant.email
            );
            if (participant.interests === undefined ||
                participantExists ||
                !participant.interests.some((x) => x === interest)) 
            return false;
            if (participant.interests.includes(interest) && 
                !participantExists) 
            {
                participants.push(participant);
                return true;
            } 
            return false;
        },
        excludePerson: (email) => {
            const friendIndex = participants.findIndex((friend) => friend.email === email);
            if (friendIndex !== -1) 
            {
                participants.filter(x => x.email !== email);
                return true;
            }
            return false;
        },
    };
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
 function findMeetingMembers(group, meetingDate) 
    {
    if (!(meetingDate instanceof Date) || typeof group !== "object" ||
    !group.getAll) 
        return 0;
    let result = group.getAll().filter(x => meetingDate >= x.freeRange.startDate && meetingDate <= x.freeRange.endDate);
    return result.length;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
 function findMeetingDateWithMaximumMembers(group) {
    if (!group instanceof Object || 
        group === undefined ||
        !group.hasOwnProperty("getAll") ||
        !typeof group.getAll == 'function' ||
        group.getAll().length === 0)
        return null;

    if (group.getAll().length === 1) {
        return group.getAll()[0].freeRange.startDate;
    }
    let countParticipants = 0;
    let maxDate;
    let maxCount = 0;
    const people = group.getAll();
    const dates = people.map(y => y.freeRange.startDate)
    dates.forEach(x => {
    maxCount = findMeetingMembers(group,x);
        if (maxCount > countParticipants) 
        {
            countParticipants = maxCount;
            maxDate = x;
        }
    });
    if(isNaN(maxDate.getTime()))
        return null;
    return maxDate;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
