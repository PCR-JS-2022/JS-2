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
    let group = [];

    return {
        getAll: () => {
            return group;
        },

        includePerson: (person) => {
            if (group.some((p) => p.email === person.email) || !person.interests.some((i) => i === interest)) {
                return false;
            }

            else {
                group.push(person);
                return true;
            };
        },
        excludePerson: (email) => {
            if (group.some((p) => p.email === email)) {
                const index = group.findIndex((p) => p.email === email);
                group.splice(index, 1);
                return true;
            };
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
    if (!group.getAll() || typeof !meetingDate.getMonth === 'function') {
        return 0;
    }

    else {
        return group.getAll().filter((p) => p.freeRange.startDate <= meetingDate && p.freeRange.endDate >= meetingDate).length;
    };
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!group.getAll() || group.getAll().length < 1) {
        return null;
    }

    groupList = group.getAll();
    let bestDate = groupList.map((p) => p.freeRange.startDate).sort((a, b) => a - b)[0];
    let maxPersons = 0;

    groupList.map((x) => x.freeRange.startDate).forEach(date => {
        let suitablePeopleCount = groupList.filter((p) => date >= p.freeRange.startDate && date <= p.freeRange.endDate).length;

        if (maxPersons < suitablePeopleCount) {
            bestDate = date;
            maxPersons = suitablePeopleCount;
        };
    });
    return bestDate;
};

const phoneList = [
    {
        name: 'Александра',
        interests: ['games', 'computers'],
        email: 'alexandra@rambler.ru',
        freeRange: {
            startDate: new Date('01.01.2020'),
            endDate: new Date('03.10.2020'),
        }
    },
    {
        name: 'Василий',
        interests: ['games'],
        email: 'vasiliy@mail.ru',
        freeRange: {
            startDate: new Date('02.05.2020'),
            endDate: new Date('02.25.2020'),
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

const gamesGroup = createGroup('games');
console.log(gamesGroup.includePerson(phoneList[0])); // true
console.log(findMeetingDateWithMaximumMembers(gamesGroup));

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
