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
    const personsList = []
    return{
        getAll: () => personsList, 

        includePerson: (person) => {
            if (person.interests?.includes(interest) && personsList.every(({ email }) => email !== person.email)) {
                personsList.push(person);
                return true;
                }
            else {
                return false;
            }
        }, 

        excludePerson: (email) => {
            const checkEmail = personsList.findIndex(person => person.email === email);
            if (checkEmail === -1) {
              return false;
            }
            else {
                personsList.splice(checkEmail, 1);
            return true;
            }
          }    
    }
};


/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */


function findMeetingMembers(group, meetingDate) {
    if (!(meetingDate instanceof Date) || isNaN(meetingDate.valueOf()))
        return 0;
    const persons = group.getAll().filter((person) =>
        (meetingDate >= person.freeRange.startDate && meetingDate <= person.freeRange.endDate));
    return persons.length;    
    }


/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */


function findMeetingDateWithMaximumMembers(group) {
    if(!group.getAll){
        return null;
    }
    if (group.getAll().length === 1){
        return group.getAll()[0].freeRange.startDate;
    }
    const startDates = group.getAll().map((day) => day.freeRange.startDate);
    let bestDate = new Date();
    let maximumPersons = 0;
    startDates.forEach((dateX) => {
        let personsCount = group.getAll().filter((person) => (
            dateX >= person.freeRange.startDate && dateX <= person.freeRange.endDate)).length;
        if (personsCount > maximumPersons) {
            maximumPersons = personsCount;
            bestDate = dateX;
        }
    });
    return bestDate;
}


module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
