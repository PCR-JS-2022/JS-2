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

function correctStr(interest) {
    return typeof interest === 'string';
}

function correctData(date) {
    return date instanceof Date;
}

function correctPerson(person) {
    return (typeof person === 'object' && typeof person.name === 'string'
        && Array.isArray(person.interests) && typeof person.email === 'string'
        && typeof person.freeRange === 'object' && correctData(person.freeRange.startDate)
        && correctData(person.freeRange.endDate)
    );
}

function createGroup(interest) {
    if (!correctStr(interest)) {
        return [];
    }

    let listInterest = [];
    return {

        getAll: function () {
            return listInterest;
        },

        includePerson: function (person) {
            if (correctPerson(person)) {
                const len = person.interests.length;
                for (let i = 0; i < len; i++) {
                    const isEmailList = listInterest.find(el => el.email === person.email)
                    if (interest === person.interests[i] && isEmailList === undefined) {
                        listInterest.push(person);
                        return true;
                    }
                }
            }
            return false;
        },

        excludePerson: function (email) {
            if (correctStr(email)) {
                const newListInterest = listInterest.filter(el => el.email !== email);
                return listInterest.length > newListInterest.length;
            }

            return false;
        }
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */

function correctGroup(group) {
    return group.hasOwnProperty('getAll');
}

function findMeetingMembers(group, meetingDate) {
    if (!correctData(meetingDate) || !correctGroup(group)) {
        return 0;
    }

    const frineds = group.getAll().filter(friend =>
        (meetingDate >= friend.freeRange.startDate && meetingDate <= friend.freeRange.endDate));
    return frineds.length;
};


/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */


function findMeetingDateWithMaximumMembers(group) {
    if (!correctGroup(group)) {
        return null;
    }

    const friends = group.getAll();
    if (friends.length === 0) {
        return null;
    }
    let date = new Date();
    let maxFrineds = 0;
    const startdats = friends.map(friend => friend.freeRange.startDate);
    startdats.sort((d1, d2) => {
        return d1 - d2;
    });

    startdats.forEach(el => {
        let meetFrineds = findMeetingMembers(group, el);
        if (meetFrineds === 0) {
            date = null;
        } else if (meetFrineds > maxFrineds) {
            maxFrineds = meetFrineds;
            date = el;
        }
    });

    return date;
};


module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
