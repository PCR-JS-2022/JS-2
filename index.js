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
        participants,
        getAll: () => participants,
        includePerson: (participant) => {
            if (participant.interests === undefined ||
                participants.some((friend) => friend.email === participant.email) ||
                !participant.interests.some((x) => x === interest)) 
            return false;
            const participantExists = participants.some(
                (friend) => friend.email === participant.email
            );
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
                participants.splice(friendIndex, 1);
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
    let result = [];
    if (!(meetingDate instanceof Date) || typeof group !== "object" ||
    !group.getAll) 
        return 0;
    group.getAll().forEach((participants) => 
    {
        if (meetingDate >= participants.freeRange.startDate &&
            meetingDate <= participants.freeRange.endDate) 
        {
            result.push(participants);
        }
    });
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
    let dates = group.getAll().map(y => y.freeRange.startDate)
    dates.forEach(x => {
    let meetingFriends = group.getAll().filter(participants => x >= participants.freeRange.startDate && x <= participants.freeRange.endDate);
    maxCount = meetingFriends.length;
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
