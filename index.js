'use strict'
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
    if (interest !== '' && typeof (interest) === 'string') {
        return {
            key: interest,
            friends: [],
            includePerson(friend) {
                if (isFriendValid(friend) === true &&
                    friend && friend.interests.includes(this.key) &&
                    !this.friends.some((el) => isEqual(el, friend))) {
                    this.friends.push(friend);
                    return true
                } else { return false };
            },
            excludePerson(mail) {
                const startLength = this.friends.length;
                this.friends = this.friends.filter(el => el.email !== mail);
                return startLength !== this.friends.length ? true : false;
            },
            getAll() {
                return this.friends
            }
        };
    };
};

// const javaScriptGroup = createGroup('javascript');
// javaScriptGroup.includePerson(phoneList[2]); // true
// javaScriptGroup.includePerson(phoneList[0]); // false
// javaScriptGroup.includePerson(phoneList[3]); // true
// console.log(javaScriptGroup.excludePerson('vasiliy@mail.ru')); // false
// console.log(javaScriptGroup.excludePerson('roman@yandex.ru')); // true


//console.log(JSON.stringify(javaScriptGroup.getAll()));

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */

function findMeetingMembers(group, meetingDate) {
    let stDay = 0;
    let lastDay = 0;
    if (group && meetingDate instanceof Date) {
        group.friends.forEach(element => {
            stDay += (element.freeRange.startDate <= meetingDate) ? 1 : 0;
            lastDay += (element.freeRange.endDate >= meetingDate) ? 1 : 0;
        });
    };
    return Math.min(stDay, lastDay)
    // return (stDay <= lastDay) ? stDay : lastDay

};

// const javaScriptGroup = createGroup('javascript');
// console.log(javaScriptGroup.includePerson(phoneList[2])); // true
// console.log(javaScriptGroup.includePerson(phoneList[3])); // true

// console.log(findMeetingMembers(javaScriptGroup, new Date('10.10.2020'))); // 0
// console.log(findMeetingMembers(javaScriptGroup, new Date('06.10.2020'))); // 2

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */

function findMeetingDateWithMaximumMembers(group) {
    const checkArr = group.friends;
    console.log(ddfd)
    if (checkArr && checkArr.length !== 0) {
        const checkDates = [];
        checkArr.forEach(el => {
            checkDates.push(el.freeRange.startDate);
            checkDates.push(el.freeRange.endDate);
        });
        checkDates.sort((a, b) => a >= b ? 1 : -1);
        let maxInd = 0;
        let maxMem = 0;
        checkDates.forEach((el, ind) => {
            const members = findMeetingMembers(group, el);
            if (members > maxMem) {
                maxInd = ind;
                maxMem = members;
            };
        })
        return checkDates[maxInd];
    } else {
        return null
    };
};

// const gamesGroup = createGroup('games');
// gamesGroup.includePerson(phoneList[0]); // true
// gamesGroup.includePerson(phoneList[1]); // true

// console.log(findMeetingDateWithMaximumMembers(gamesGroup)); // 02.05.2020



function isEqual(object1, object2) {
    const props1 = Object.getOwnPropertyNames(object1);
    const props2 = Object.getOwnPropertyNames(object2);

    if (props1.length !== props2.length) {
        return false;
    } else {
        for (let i = 0; i < props1.length; i++) {
            const prop = props1[i];
            const bothAreObjects = typeof (object1[prop]) === 'object' && typeof (object2[prop]) === 'object';

            if ((!bothAreObjects && (object1[prop] !== object2[prop]))
                || (bothAreObjects && !isEqual(object1[prop], object2[prop]))) {
                return false;
            };
        };

        return true;
    };
};

// Это на всякий случай!!!
function isFriendValid(el) {
    if (el && typeof (el) === 'object' &&
        el.name && typeof (el.name) === 'string' &&
        el.interests && Array.isArray(el.interests) &&
        el.interests.every((elem) => typeof (elem) === 'string') &&
        el.email && typeof (el.email) === 'string' &&
        el.freeRange && typeof (el.freeRange) === 'object' &&
        el.freeRange.startDate && el.freeRange.startDate instanceof Date &&
        el.freeRange.endDate && el.freeRange.endDate instanceof Date
    ) {
        return true
    };
}

function arrayMin(arr) {
    return arr.reduce((p, v) => {
        return (p < v ? p : v);
    });
}

function arrayMax(arr) {
    return arr.reduce((p, v) => {
        return (p > v ? p : v);
    });
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
