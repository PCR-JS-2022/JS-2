const phoneList = [{
    name: 'Александра',
    interests: ['games', 'computers'],
    email: 'alexandra@rambler.ru',
    freeRange: {
        startDate: new Date('01.01.2020'),
        endDate: new Date('05.10.2020'),
    }
},
    {
        name: 'Василий',
        interests: ['games'],
        email: 'vasiliy@mail.ru',
        freeRange: {
            startDate: new Date('02.05.2020'),
            endDate: new Date('10.25.2020'),
        }
    },
    {
        name: 'Роман',
        email: 'roman@yandex.ru',
        interests: ['javascript'],
        freeRange: {
            startDate: new Date('05.01.2020'),
            endDate: new Date('06.10.2020'),
        }
    },
    {
        name: 'Егор',
        email: 'egor@gmail.ru',
        interests: ['computers', 'javascript'],
        freeRange: {
            startDate: new Date('03.01.2020'),
            endDate: new Date('08.10.2020'),
        }
    },
];
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
    return {
        interest: interest,
        friends: [],
        getAll: function () {
            return this.friends;
        },
        includePerson: function (person) {
            if ((person.interests.find((interest) => interest === this.interest) !== undefined)
                && this.friends.find((friend) => friend.email === person.email) === undefined) {
                this.friends.push(person);
                return true;
            }
            return false;
        },
        excludePerson: function (email) {
            let person = this.friends.findIndex((friend) => friend.email === email);
            if (person !== -1) {
                this.friends.splice(person, 1);
                return true;
            }
            return false;
        }
    };
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
    if (!isGroup(group) || !meetingDate instanceof Date)
        return 0;
    let personCount = 0;
    for (let person of group.getAll()) {
        if (+meetingDate >= +person.freeRange.startDate && +meetingDate <= +person.freeRange.endDate)
            personCount++;
    }
    return personCount;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {

};

/**
 * Check, is variable object with type "Group" or not
 * @param {Group} group
 * @returns {boolean}
 */
function isGroup(group) {
    return (typeof group === 'object')
        && (group.hasOwnProperty('getAll'))
        && (group.hasOwnProperty('includePerson'))
        && (group.hasOwnProperty('excludePerson'));
}

/*
module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers
};*/
