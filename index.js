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
    const personsInGroup = new Map()
    return {
        getAll: () =>{
            return Array.from(personsInGroup.values());
        },
        
        /**
         * @param {Person} person - человек, которого необходимо добавить
         * @returns {boolean} успешность вставки
         */
        includePerson: (person) =>{
            if(personsInGroup.has(person.email) || !person.interests?.find(personInterest => personInterest === interest))
                return false;
            personsInGroup.set(person.email, person);
            return true;
        },

        /**
         * @param {Person} personEmail - почта
         * @returns {boolean} успешность удаления
         */
        excludePerson: (personEmail) =>{
            if(typeof personEmail != 'string' || !personsInGroup.has(personEmail))
                return false;
            personsInGroup.delete(personEmail);
            return true;
        }
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if(!meetingDate?.getDate())
        return 0;
    return group?.getAll()
                ?.filter(person => person.freeRange?.startDate <= meetingDate && person.freeRange?.endDate >= meetingDate)
                ?.length ?? 0;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if(group?.length < 2)
        return null;
    const dateRanges = group.getAll()
                            .map(person => person.freeRange)
                            .sort((dateRange1, dateRange2) => dateRange1.startDate <= dateRange2 ? -1 : 1);
    let dateIntersections = getDateIntersections(dateRanges);
    while(dateIntersections.length > 1){
        dateIntersections = getDateIntersections(dateIntersections);
    }
    return dateIntersections[0].startDate;
};

/**
 * @param {{ startDate: Date, endDate: Date }} dateRange1 
 * @param {{ startDate: Date, endDate: Date }} dateRange2 
 * @returns {{{ startDate: Date, endDate: Date }}} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findDateIntersection(dateRange1, dateRange2){
    if(dateRange2.startDate < dateRange1.endDate)
        return {
            startDate: dateRange2.startDate,
            endDate: dateRange1.endDate < dateRange2.endDate ? dateRange1.endDate : dateRange2.endDate,
        }
    return null;
}

function getDateIntersections(dateRanges){
    const result = [];
    for (let i = 0; i < dateRanges.length - 1; i++) {
        const current = dateRanges[i];
        const next = dateRanges[i + 1]
        const intersection = findDateIntersection(current, next);
        if(intersection)
            result.push(intersection);
    }
    return result;
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

// test 1 task
// const javaScriptGroup = createGroup('javascript');
// console.log(javaScriptGroup.includePerson(phoneList[2])); //true
// console.log(javaScriptGroup.includePerson(phoneList[0])); //false
// console.log(javaScriptGroup.includePerson(phoneList[3])); //true
// console.log(javaScriptGroup.includePerson(1)); //true

// console.log(javaScriptGroup.excludePerson('vasiliy@mail.ru')); // false
// console.log(javaScriptGroup.excludePerson('roman@yandex.ru')); // true

// console.log(javaScriptGroup.getAll());


// //test 2 task
// const javaScriptGroup = createGroup('javascript');
// javaScriptGroup.includePerson(phoneList[2]); // true
// javaScriptGroup.includePerson(phoneList[3]); // true

// console.log(findMeetingMembers(javaScriptGroup, new Date('10.10.2020'))); // 0
// console.log(findMeetingMembers(javaScriptGroup, new Date('06.10.2020'))); // 2

// //test 3 task
// const gamesGroup = createGroup('games');
// gamesGroup.includePerson(phoneList[0]); // true
// gamesGroup.includePerson(phoneList[1]); // true

// const result = findMeetingDateWithMaximumMembers(gamesGroup);
// console.log(result.toLocaleString()); // 02.05.2020


module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
