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

// const phoneList = [
//     {
//         name: 'Александра',
//         interests: ['games', 'computers'],
//         email: 'alexandra@rambler.ru',
//         freeRange: {
//             startDate: new Date('01.01.2020'),
//             endDate: new Date('03.10.2020'),
//         }
//     },
//     {
//         name: 'Василий',
//         interests: ['games'],
//         email: 'vasiliy@mail.ru',
//         freeRange: {
//             startDate: new Date('02.05.2020'),
//             endDate: new Date('02.25.2020'),
//         }
//     },
//     {
//         name: 'Роман',
//         email: 'roman@yandex.ru',
//         interests: ['javascript'],
//         freeRange: {
//             startDate: new Date('05.01.2020'),
//             endDate: new Date('06.10.2020'),
//         }
//     },
//     {
//         name: 'Егор',
//         email: 'egor@gmail.ru',
//         interests: ['computers', 'javascript'],
//         freeRange: {
//             startDate: new Date('03.01.2020'),
//             endDate: new Date('08.10.2020'),
//         }
//     },
// ];


// const javaScriptGroup = createGroup('javascript');
// console.log(JSON.stringify(javaScriptGroup.includePerson(phoneList[2])));
// console.log(JSON.stringify(javaScriptGroup.includePerson(phoneList[0])));
// console.log(JSON.stringify(javaScriptGroup.includePerson(phoneList[3])));
// console.log('   ')
// console.log(JSON.stringify(javaScriptGroup.excludePerson('vasiliy@mail.ru')));
// console.log(JSON.stringify(javaScriptGroup.excludePerson('roman@yandex.ru')));
// console.log(JSON.stringify(javaScriptGroup.getAll()));

/*
  [
    {
      name: 'Егор',
      interests: ['computers', 'javascript'],
      email: 'egor@gmail.ru',
      freeRange: {
        startDate: new Date('03.01.2020'),
        endDate: new Date('08.10.2020'),
      }
    },
  ]
*/



/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {

};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {

};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
