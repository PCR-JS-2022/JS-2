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
        getAll: () => {
            return group;
        },

        includePerson: (friend) => {
            if (friend.interests === undefined) return false;

            if (group.some(e => e.email === friend.email) || !friend.interests.includes(interest))
                return false;

            group.push(friend);
            return true;
        },

        excludePerson: (email) => {
            const friendId = (e) => e.email === email
            const index = group.findIndex(friendId);

            if (index === -1)
                return false;

            group.splice(index, 1);
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
    if (!(meetingDate instanceof Date || group.getAll))
        return 0;

    const friends = group.getAll;
    let trueFriends = 0;
    friends.forEach(e => {
        if (meetingDate >= e.freeRange.startDate && meetingDate <= e.freeRange.endDate)
            trueFriends++;
    });

    return trueFriends;
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */

function findMeetingDateWithMaximumMembers(group) {
    if (!group.getAll) return null;

    const friends = group.getAll();
    let count = 0;
    let date = 0;

    friends.forEach(e => {
        const date1 = e.freeRange.startDate.getTime();
        const date2 = e.freeRange.endDate.getTime();

        for (let i = date1; i < date2; i += 86400000) {
            let localCount = 0;
            friends.forEach(x => {
                if (i >= x.freeRange.startDate.getTime() && i <= x.freeRange.endDate.getTime())
                    localCount++;
            });

            if (localCount > count) {
                count = localCount;
                date = i;
            }
        }
    });
    return new Date(date);
}

const phoneList = [{
        name: "Александра",
        interests: ["games", "computers"],
        email: "alexandra@rambler.ru",
        freeRange: {
            startDate: new Date("01.01.2020"),
            endDate: new Date("03.10.2020"),
        },
    },
    {
        name: "Василий",
        interests: ["games"],
        email: "vasiliy@mail.ru",
        freeRange: {
            startDate: new Date("02.05.2020"),
            endDate: new Date("02.25.2020"),
        },
    },
    {
        name: "Роман",
        email: "roman@yandex.ru",
        interests: ["javascript"],
        freeRange: {
            startDate: new Date("05.01.2020"),
            endDate: new Date("06.10.2020"),
        },
    },
    {
        name: "Егор",
        email: "egor@gmail.ru",
        interests: ["games", "javascript"],
        freeRange: {
            startDate: new Date("03.01.2020"),
            endDate: new Date("08.10.2020"),
        },
    },
];



const javaScriptGroup = createGroup('javascript');
console.log(javaScriptGroup.includePerson(phoneList[2])); //true
console.log(javaScriptGroup.includePerson(phoneList[3])); //true
console.log(findMeetingMembers(javaScriptGroup, new Date('10.10.2020'))); // 0
console.log(findMeetingMembers(javaScriptGroup, new Date('06.10.2020'))); // 2


module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers,
};