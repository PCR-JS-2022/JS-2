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
    const group = [];
    return {
        getAll() {
            return group;
        },
        includePerson(person) {
            const isMember = group.indexOf(person) > -1;
            const hasInterest = person.interests.includes(interest);
            if (group.length > 0 && (isMember || !hasInterest)) return false;
            else {
                group.push(person);
                return true;
            }
        },
        excludePerson(mail) {
            const index = group.indexOf(group.find(member => member.email === mail));
            if (index !== -1) {
                group.splice(index, 1);
                return true;
            }
            else return false
        }
    }
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */

function findMeetingMembers(group, meetingDate) {
    if (!group.getAll || typeof meetingDate !== 'object') return 0;
    return group
        .getAll()
        .filter(member => isMemberCanMeet(member, meetingDate)).length
}

function isMemberCanMeet(member, meetingDate) {
    const startDate = new Date(member.freeRange.startDate);
    const endDate = new Date(member.freeRange.endDate);
    return (meetingDate >= startDate && meetingDate <= endDate);
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {

}

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

// const javaScriptGroup = createGroup('javascript');
// console.log(javaScriptGroup.includePerson(phoneList[2])); // true
// console.log(javaScriptGroup.includePerson(phoneList[0])); // false
// console.log(javaScriptGroup.includePerson(phoneList[3])); // true
//
// console.log(javaScriptGroup.excludePerson('vasiliy@mail.ru')); // false
// console.log(javaScriptGroup.excludePerson('roman@yandex.ru')); // true
//
// console.log(javaScriptGroup.getAll());


const javaScriptGroup = createGroup('javascript');
console.log(javaScriptGroup.includePerson(phoneList[2])); // true
console.log(javaScriptGroup.includePerson(phoneList[3])); // true

console.log(findMeetingMembers(javaScriptGroup, new Date('10.10.2020'))); // 0
console.log(findMeetingMembers(javaScriptGroup, new Date('06.10.2020'))); // 2
module.exports = {createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers};
