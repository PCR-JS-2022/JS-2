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
    "use strict";

    let friends = [];

    function getAll() {
        let friendsFromGroup = friends.filter((friend) =>
            friend.interests.includes(interest)
        );
        return friendsFromGroup;
    }
    function includePerson(friend) {
        //validation for interest
        if (!friend.interests.includes(interest)) {
            return false;
        }
        //validation for availability
        for (var i = 0; i < friends.length; ++i) {
            if (friends[i].email == friend.email) {
                return false;
            }
        }
        friends.push(friend);
        return true;
    }
    function excludePerson(email) {
        for (var i = 0; i < friends.length; ++i) {
            if (friends[i].email == email) {
                friends.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    const group = {
        getAll: getAll,
        includePerson: includePerson,
        excludePerson: excludePerson,
    };
    return group;
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
    "use strict";

    //validation group
    if (!(typeof group == "object")) {
        return 0;
    }
    if (
        !group.hasOwnProperty("getAll") ||
        !group.hasOwnProperty("includePerson") ||
        !group.hasOwnProperty("excludePerson")
    ) {
        return 0;
    }
    //validation date
    if (isNaN(Date.parse(meetingDate))) {
        return 0;
    }
    const friends = group.getAll();
    let count = 0;
    for (var i = 0; i < friends.length; ++i) {
        let startDate = friends[i].freeRange.startDate;
        let endDate = friends[i].freeRange.endDate;
        if (meetingDate >= startDate && meetingDate <= endDate) {
            count += 1;
        }
    }
    return count;
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    "use strict";

    //validation group
    if (!(typeof group == "object")) {
        return null;
    }
    if (
        !group.hasOwnProperty("getAll") &&
        !group.hasOwnProperty("includePerson") &&
        !group.hasOwnProperty("excludePerson")
    ) {
        return null;
    }
    const friends = group.getAll();
    let meetingDate = { date: null, count: 0 };
    for (var i = 0; i < friends.length; ++i) {
        let startDate = friends[i].freeRange.startDate;
        let endDate = friends[i].freeRange.endDate;
        for (
            var day = startDate;
            day <= endDate;
            day.setDate(day.getDate() + 1)
        ) {
            let count = 0;
            for (var j = 0; j < friends.length; ++j) {
                if (j == i) {
                    continue;
                }
                if (
                    day >= friends[j].freeRange.startDate &&
                    day <= friends[j].freeRange.endDate
                ) {
                    count += 1;
                }
            }
            if (count > meetingDate.count) {
                meetingDate.date = new Date(day);
                meetingDate.count = count;
            }
        }
    }
    return meetingDate.date;
}

module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers,
};
