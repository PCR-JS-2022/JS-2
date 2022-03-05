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
    let listInterest = [];
    return {

        getAll: function () {
            return listInterest;
        },

        includePerson: function (person) {
            let len = person.interests.length;
            for (let i = 0; i < len; i++) {
                if (interest === person.interests[i] && listInterest.findIndex(el => el.email === person.email) === -1) {
                    listInterest.push(person);
                    return true;
                }
            }

            return false;
        },

        excludePerson: function (email) {
            for (let i = 0; i < listInterest.length; i++) {
                if (listInterest[i].email === email) {
                    listInterest.splice(i, 1);
                    return true;
                }

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

function correctData(date) {
    return Object.prototype.toString.call(date) === '[object Date]';
};

function correctGroup(group) {
    return group.hasOwnProperty('getAll');
}

function findMeetingMembers(group, meetingDate) {
    if (!correctData(meetingDate) || !correctGroup(group)) {
        return 0;
    }

    let frineds = group.getAll().filter(friend =>
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
    let friends = group.getAll();
    let maxFrineds = 0;
    let date = new Date();
    let startdats = friends.map(friend => friend.freeRange.startDate);
    startdats.sort((d1, d2) => {
        return d1 - d2;
    });
    startdats.forEach(el => {
        let meetFrineds = findMeetingMembers(group, el);
        if (meetFrineds > maxFrineds) {
            maxFrineds = meetFrineds;
            date = el;
        }
    });
    return date;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
