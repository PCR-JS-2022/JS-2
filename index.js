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

function createGroup(interest) {
    const friendsGroup = [];
    return {
        getAll() {
            return friendsGroup;
        },
        includePerson(friend) {
            if(friend.interests === undefined) return false;
            if(friend.interests.includes(interest)) {
                if(friendsGroup.indexOf(friend) === -1) {
                    friendsGroup.push(friend);
                    return true;
                } else {
                    return false;
                }
            } 
            return false;
        },
        excludePerson(email) {
            result = false;
            phoneList.forEach(friend => {
                if(friendsGroup.includes(friend) && friend.email === email) {
                    friendsGroup.splice(friendsGroup.indexOf(friend), 1);
                    result = true;
                }
            });
            return result;
        }
    }
};

// const javaScriptGroup = createGroup("javascript");
// console.log(javaScriptGroup.includePerson(phoneList[0])); //true
// console.log(javaScriptGroup.includePerson(phoneList[2])); //true
// console.log(javaScriptGroup.excludePerson("egor@gmail.ru")); //false
// console.log(javaScriptGroup.excludePerson("egor@gmail.ru")); //false
// console.log(javaScriptGroup.excludePerson("roman@yandex.ru")); //true
// console.log(javaScriptGroup.getAll());
// console.log(javaScriptGroup.includePerson(phoneList[2]));
// console.log(javaScriptGroup.includePerson(phoneList[1]));
// console.log(javaScriptGroup.getAll());

// console.log(javaScriptGroup.getAll())
// console.log(javaScriptGroup.includePerson(phoneList[3]));
// console.log(javaScriptGroup.includePerson(phoneList[2]));
// console.log(javaScriptGroup.excludePerson('roman@yandex.ru'))
// console.log(javaScriptGroup.excludePerson("'vasiliy@mail.ru'"))
// console.log(javaScriptGroup.getAll())

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if(!(group.getAll || meetingDate instanceof Date)) return 0;
    const friendsGroup = group.getAll();
    meetingDate = meetingDate.getTime();
    return friendsGroup.reduce((count, current) => {
        const startDate = current.freeRange.startDate.getTime();
        const endDate = current.freeRange.endDate.getTime();
        if(meetingDate >= startDate && meetingDate <= endDate) {
            count++;
        }
        return count;
    }, 0)
};
// const javaScriptGroup = createGroup('javascript');
// javaScriptGroup.includePerson(phoneList[2]); // true
// javaScriptGroup.includePerson(phoneList[3]); // true

// console.log(findMeetingMembers(javaScriptGroup, new Date('10.10.2020'))); // 0
// console.log(findMeetingMembers(javaScriptGroup, new Date('06.10.2020'))); // 2

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */

function findIndexMax(arr) {
    let max = arr[0];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] > max) max = arr[i];
    }
    return arr.indexOf(max);
};

function findMeetingDateWithMaximumMembers(group) {
    if(!group.getAll) return null;

    const friendsGroup = group.getAll();

    const dates = friendsGroup.reduce((res, current) => { //собрали все даты
        res.push(current.freeRange.startDate);
        res.push(current.freeRange.endDate);
        return res;
    }, []);
    const sortedDates = dates.sort((a, b) => {
        return a - b;
    })
    const counts = sortedDates.map(i => findMeetingMembers(group, i));
    const maxCountIndex = findIndexMax(counts);
    return sortedDates[maxCountIndex];
};

// const javaScriptGroup = createGroup('games');
// javaScriptGroup.includePerson(phoneList[0]); // true
// javaScriptGroup.includePerson(phoneList[1]); // true
// console.log(findMeetingDateWithMaximumMembers(javaScriptGroup));

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
