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
    let interestGroup = [];

    function getAll() {
        return interestGroup;
    }

    function includePerson(person) {
        if (person.interests?.includes(interest) && !interestGroup.includes(person)) {
            interestGroup.push(person);
            return true;
        }
        return false;
    }

    function excludePerson(email) {
        let personIndex = interestGroup.findIndex(person => person.email === email);

        if (personIndex != -1) {
            interestGroup.splice(personIndex);
            return true;
        }
        return false;
    }

    return {
        getAll,
        includePerson,
        excludePerson
    }
};

const phoneList = [
    {
        name: 'Александра',
        interests: ['games', 'computers'],
        email: 'alexandra@rambler.ru',
        freeRange: {
            startDate: new Date('01.01.2020'),
            endDate: new Date('01.10.2020'),
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

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (typeof group.getAll != 'function')
        return 0;

    let count = 0;

    group.getAll().forEach(person => {
        ((person.freeRange.startDate <= meetingDate) && (meetingDate <= person.freeRange.endDate)) ? count++ : count;
    })

    return count;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (typeof group.getAll != 'function')
        return null;

    let n = group.getAll().length;
    let startDates = group.getAll().map(person => person.freeRange.startDate);
    let endDates = group.getAll().map(person => person.freeRange.endDate);

    startDates.sort((a, b) => a - b)
    endDates.sort((a, b) => a - b)

    let numCanCome = 0, maxCanCome = 0, date = new Date(0);
    let i = 1, j = 0;

    while (i < n && j < n) {

        if (startDates[i] <= endDates[j]) {
            numCanCome++;

            if (numCanCome > maxCanCome) {
                maxCanCome = numCanCome;
                date = startDates[i];
            }
            i++;
        }
        else {
            numCanCome--;
            j++;
        }
    }

    if (maxCanCome === 0)
        return null;

    return date;
};

const gamesGroup = createGroup('games');
console.log(JSON.stringify(gamesGroup.includePerson(phoneList[0]))); // true
console.log(JSON.stringify(gamesGroup.includePerson(phoneList[1]))); // true

console.log(JSON.stringify(findMeetingDateWithMaximumMembers(gamesGroup))); // 02.05.2020

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
