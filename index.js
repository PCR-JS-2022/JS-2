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

class Group {
    persons;
    interest;

    getAll() {
        return this.persons;
    }

    includePerson(person) {
        let haveInterest = person.interests.includes(this.interest);
        let inPersons = this.persons.includes(person);
        let result = haveInterest && !inPersons;
        if(result)
            this.persons.push(person);
        return result;
    }

    excludePerson(email) {
        let person = this.persons.find((element, index, array) => element.email == email);
        if(person === undefined)
            return false;
        let index = this.persons.indexOf(person);
        if (index <= -1) 
            return false;
        this.persons.splice(index, 1);
        return true;
    }
}

/**
 * @param {string} interest - интерес группы
 * @returns {Group} созданная группа
 */
function createGroup(interest) {
    var result = new Group()
    result.interest = interest;
    result.persons = new Array();
    return result;
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    var persons = group.persons.filter((person) => person.freeRange.startDate <= meetingDate 
      && person.freeRange.endDate >= meetingDate);
    return persons.length;
};

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate));
      currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    let minDay = Math.min.apply(null, group.persons.map(p => p.freeRange.startDate));
    let maxDay = Math.max.apply(null, group.persons.map(p => p.freeRange.endDate));
    let minInDate = new Date(minDay - (new Date().getTimezoneOffset() * 60 * 1000));
    let maxInDate = new Date(maxDay - (new Date().getTimezoneOffset() * 60 * 1000));
    let dates = getDates(minInDate, maxInDate);
    let minDate = minInDate;
    let maxPeople = 1;
    for(let i = 0; i < dates.length; i++)
    {
        let peopleToday = findMeetingMembers(group, dates[i]);
        if(peopleToday == group.persons.length)
            return dates[i];
        if(peopleToday > maxPeople)
        {
            maxPeople = peopleToday;
            minDate = dates[i];
        }
    }
    return minDate;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };

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
