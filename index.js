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
            const checkInterests = participant.interests !== undefined ||
            participant.interests.some((x) => x === interest);
            if (
                participantExists ||
                !checkInterests) 
            return false;
            if (checkInterests && !participantExists) 
            {
                participants.push(participant);
                return true;
            } 
            return false;
        },
        excludePerson: (email) => {
            const oldLength = participants.length;
            const newParticipants = participants.filter(x => x.email !== email);
            if (oldLength > newParticipants.length)
                return true;
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
    const result = group.getAll().filter(x => meetingDate >= x.freeRange.startDate && meetingDate <= x.freeRange.endDate);
    return result.length;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
 function findMeetingDateWithMaximumMembers(group) {
    const people = group.getAll();
    if (!group instanceof Object || 
        group === undefined ||
        !group.hasOwnProperty("getAll") ||
        !typeof group.getAll == 'function' ||
        people.length === 0)
        return null;

    if (people.length === 1) {
        return people[0].freeRange.startDate;
    }
    let countParticipants = 0;
    let maxDate;
    let maxCount = 0;
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
