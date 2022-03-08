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
    let members = [];

    function includePerson(person) {
        if (person.interests == undefined ||
            members.some(x => x.email == person.email) ||
            !person.interests.some(x => x == interest))
        return false;
        members.push(person);
        return true;
    };

    function getAll() {
        return members;
    }

    function excludePerson(email) {
        if (members.findIndex(x => x.email == email) < 0)
        return false;

        members = members.filter(x => x.email != email);
        return true;
    }

    return {
        getAll,
        includePerson,
        excludePerson,
      }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!group instanceof Object || group === undefined ||!group.hasOwnProperty("getAll") || !(typeof(group.getAll) == 'function') ||
    // !group.hasOwnProperty("includePreson") || !(typeof(group.includePerson) == 'function') || !group.hasOwnProperty("excludePerson") ||
    // !(typeof(group.excludePerson) == 'function') ||
    !meetingDate instanceof Date)
    return 0;
    // const friendsToMeet = group.getAll().filter((x) => meetingDate >= x.freeRange.startDate && meetingDate <= x.freeRange.endDate);
    // return friendsToMeet.length;
    let result = 0;
    group.getAll().forEach((x) => {
        if(meetingDate >= x.freeRange.startDate && meetingDate <= x.freeRange.endDate)
        {
            result++;
        }
    })
    return result;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!(group instanceof Object && group.hasOwnProperty("getAll") &&
    group.hasOwnProperty("includePreson") && group.hasOwnProperty("excludePerson"))) return null;
    const friends = group.getAll();
    if (friends.length == 0) return null;
    if (friends.length == 1) return friends[0].freeRange.startDate;
    let result = null;
    let starts = friends.map(x => x.freeRange.startDate).sort((a, b) => a - b);
    let maxCount = 0;
    starts.forEach(x => {
        const counter = findMeetingMembers(group, x);
        if (counter > maxCount) {
            maxCount = counter;
            result = x;
        }
    });
    return result;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };

// const phoneList = [
//     {
//       name: 'Александра',
//       interests: ['games', 'computers'],
//       email: 'alexandra@rambler.ru',
//       freeRange: {
//         startDate: new Date('01.01.2020'),
//         endDate: new Date('03.10.2020'),
//       }
//     },
//     {
//       name: 'Василий',
//       interests: ['games'],
//       email: 'vasiliy@mail.ru',
//       freeRange: {
//         startDate: new Date('02.05.2020'),
//         endDate: new Date('02.25.2020'),
//       }
//     },
//     {
//       name: 'Роман',
//       email: 'roman@yandex.ru',
//       interests: ['javascript'],
//       freeRange: {
//         startDate: new Date('05.01.2020'),
//         endDate: new Date('06.10.2020'),
//       }
//     },
//     {
//       name: 'Егор',
//       email: 'egor@gmail.ru',
//       interests: ['computers', 'javascript'],
//       freeRange: {
//         startDate: new Date('03.01.2020'),
//         endDate: new Date('08.10.2020'),
//       }
//     },
//   ];

//    let groupComp = createGroup('computers');
//   for (let i = 0; i < phoneList.length; i++)
//   groupComp.includePerson(phoneList[i]);
//   const num = findMeetingMembers(groupComp, new Date('05.12.2020'));