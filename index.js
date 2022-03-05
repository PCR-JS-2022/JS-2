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
 * 
 * @param {Date} date 
 * @param {{ startDate: Date, endDate: Date }} range 
 */
function isDateInRange(date, range) {
    return date >= range.startDate && date <= range.endDate;
}

/**
 * @param {string} interest - интерес группы
 * @returns {Group} созданная группа
 */
function createGroup(interest) {
    let people = []; 

    const getAll = () => people;

    /**
     * @param {Person} person 
     * @returns {boolean}
     */
    function includePerson(person) {
        if (person.interests?.includes(interest) && !people.map((p) => p.email).includes(person.email))
        {
            people.push(person);
            return true;
        }

        return false;
    }

    /**
     * @param {string} email 
     * @returns {boolean}
     */
    function excludePerson(email) {
        return people.splice(people.findIndex((p) => p.email === email)).length > 0;
    }

    return {
        getAll,
        includePerson,
        excludePerson
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    return (group.getAll && group.getAll()) && (meetingDate instanceof Date) ? 
    group
    .getAll()
    .filter((p) => isDateInRange(meetingDate, p.freeRange))
    .length
    : 0;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    const people = group.getAll && group.getAll();
    
    if (!people) {
        return null;
    }

    if (people.length === 1) 
    {
        return people[0].freeRange.startDate;
    }

    const startDates = people.map((x) => x.freeRange.startDate);

    let minDate = new Date(0);
    let maxPeople = 0;
    startDates.forEach((date) => {
        const peopleInRange = people
        .filter((p) => isDateInRange(date, p.freeRange))
        .length;

        if (peopleInRange > maxPeople) {
            maxPeople = peopleInRange;
            minDate = date;
        }
    });

    return minDate;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
