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
        interests: ["computers", "javascript"],
        freeRange: {
            startDate: new Date("03.01.2020"),
            endDate: new Date("08.10.2020"),
        },
    },
    {
        name: "ziad",
        interests: ["games", "computers"],
        email: "ziiad@rambler.ru",
        freeRange: {
            startDate: new Date("03.20.2020"),
            endDate: new Date("03.30.2020"),
        },
    },
];
const isDateInRange = (startInterval, endInterval, people) => {
    const allStartDates = people
        .flatMap((person) => person.freeRange.startDate)
        .sort((a, b) => a.getTime() - b.getTime());
    const allDatesInInterval = allStartDates.every(
        (date) =>
            date.getTime() >= startInterval.getTime() &&
            date.getTime() <= endInterval.getTime()
    );
    return allDatesInInterval ? allStartDates[allStartDates.length - 1] : null;
};
function createGroup(interest) {
    const people = [];
    return {
        people,
        getAll: () => people,
        includePerson: (person) => {
            const personExists = people.some(
                (friend) => friend.email === person.email
            );
            if (person.interests.includes(interest) && !personExists) {
                people.push(person);
                return true;
            } else return false;
        },
        excludePerson: (email) => {
            const friendIndex = people.findIndex((friend) => friend.email === email);
            if (friendIndex !== -1) {
                people.splice(friendIndex, 1);
                return true;
            } else return false;
        },
    };
}
const javascriptGroup = createGroup("javascript");
javascriptGroup.includePerson(phoneList[2]);
javascriptGroup.includePerson(phoneList[3]);
javascriptGroup.excludePerson("a7a@gmail.ru");
/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
    let result = [];
    const arugmentsInvalid =
        meetingDate instanceof Date === false ||
        typeof group !== "object" ||
        !group.getAll;
    if (arugmentsInvalid) {
        return 0;
    }
    const people = group.getAll();
    people.forEach((person) => {
        if (
            meetingDate.getTime() >= person.freeRange.startDate.getTime() &&
            meetingDate.getTime() <= person.freeRange.endDate.getTime()
        ) {
            result.push(person);
        }
    });
    return result.length;
}
/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    let result = [];
    let resultEnd = [];
    const people = group.getAll();
    people.forEach((person) => {
        result.push(person.freeRange.startDate);
        resultEnd.push(person.freeRange.endDate);
    });
    const resultStartSorted = result.sort((a, b) => a.getTime() - b.getTime());
    const resultEndSorted = resultEnd.sort((a, b) => a.getTime() - b.getTime());
    const maxStartInterval = resultStartSorted[0];
    const maxEndInterval = resultEndSorted[resultEndSorted.length - 1];
    return isDateInRange(maxStartInterval, maxEndInterval, people);
}
const gamesGroup = createGroup("games");
gamesGroup.includePerson(phoneList[1]);
gamesGroup.includePerson(phoneList[0]);
gamesGroup.includePerson(phoneList[2]);
gamesGroup.includePerson(phoneList[phoneList.length - 1]);
findMeetingDateWithMaximumMembers(gamesGroup);
module.exports = {
    createGroup,
    findMeetingMembers,
    findMeetingDateWithMaximumMembers,
};
