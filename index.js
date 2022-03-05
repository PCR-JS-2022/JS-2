/**
 * @typedef friendList
 * @type {object}
 * @property {string} name - имя
 * @property {Array<string>} interests - интересы
 * @property {string} email - почта
 * @property {{ startDate: Date, endDate: Date }} freeRange - диапазон для встречи
 */

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
    if (!interest) {
        return;
    }

    let friendList = [];

    return {
        getAll: () => friendList,
        includePerson: function (person) {
            return person.interests.includes(interest) && !friendList.some(item => item.email === person.email)
                ? friendList.push(person) && true
                : false;
        },
        excludePerson: function (email) {
            if (friendList.some(item => item.email === email)) {
                friendList = friendList.filter(p => p.email !== email);

                return true;
            } else {
                return false;
            }
        }
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!meetingDate instanceof Date || !Array.isArray(group.getAll()) || !group.getAll().length) {
        return 0;
    }

    return group.getAll().filter(item => item.freeRange.startDate <= meetingDate && item.freeRange.endDate >= meetingDate).length;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    let allDates = [];
    group.getAll().forEach(item => {
        let startDate = item.freeRange.startDate;
        while (new Date(startDate) <= item.freeRange.endDate) {
            allDates.push(startDate);
            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
        }
    });

    group.getAll().forEach(item => {
        allDates = allDates.filter(i => i >= item.freeRange.startDate && i <= item.freeRange.endDate);
    });

    return formatDateTostring(new Date(allDates[0]));
};

/** дата в формате MM.DD.YYYY */
function formatDateTostring(date) {
    if (!date) {
        return null;
    }

    let result = "";
    const dd = date.getUTCDate();
    const mm = date.getMonth() + 1; 
    const yyyy = date.getFullYear();
    if (mm < 10) {
        result += '0' + mm + '.';
    } else {
        result += mm + '.';
    }

    if (dd < 10) {
        result += '0' + dd;
    } else {
        result += dd;
    }
    
    return result + '.' + yyyy;
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
