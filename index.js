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
    const result = {
      persons: new Array(),
      interest: interest,
  
      getAll() {
          return this.persons;
      },
  
      includePerson(person) {
          try {
              const haveInterest = person.interests.includes(this.interest);
              const inPersons = this.persons.includes(person);
              const result = haveInterest && !inPersons;
              if(result)
                  this.persons.push(person);
              return result;
          }
          catch {
              return false;
          }
      },
  
      excludePerson(email) {
          try {
              let result = this.persons.filter((p) => p.email != email);
              if(result.length == this.persons.length)
                return false;
              this.persons = result;              
              return true;
          }
          catch {
              return false;
          }
      }
    };
    return result;
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    try {
        const persons = group.getAll().filter((person) => person.freeRange.startDate <= meetingDate 
          && person.freeRange.endDate >= meetingDate);
        return persons.length;
    }
    catch {
        return 0;
    }
};

Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function getDates(startDate, stopDate) {
  const dateArray = new Array();
  let currentDate = startDate;
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
    try {
        const persons = group.getAll();
        if(persons == undefined || persons.length < 1)
            return null;
        const minDay = Math.min.apply(null, persons.map(p => p.freeRange.startDate));
        const maxDay = Math.max.apply(null, persons.map(p => p.freeRange.endDate));
        const timezoneOffest = new Date().getTimezoneOffset() * 60 * 1000;
        const minInDate = new Date(minDay - timezoneOffest);
        const maxInDate = new Date(maxDay - timezoneOffest);
        let currentDate = minInDate;
        let minDate = minInDate;
        let maxPeople = 1;
        for(let i = 0; currentDate <= maxInDate; i++)
        {
            let peopleToday = findMeetingMembers(group, currentDate);
            if(peopleToday == persons.length)
                return currentDate;
            if(peopleToday > maxPeople)
            {
                maxPeople = peopleToday;
                minDate = currentDate;
            }
            currentDate = currentDate.addDays(1);
        }
        return minDate;
    }
    catch {
        return null;
    }
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

  const javaScriptGroup = createGroup('javascript');
  console.log(javaScriptGroup.includePerson(phoneList[2])); // true
  console.log(javaScriptGroup.includePerson(phoneList[0])); // false
  console.log(javaScriptGroup.includePerson(phoneList[3])); // true

  console.log(javaScriptGroup.excludePerson('vasiliy@mail.ru')); // false
  console.log(javaScriptGroup.excludePerson('roman@yandex.ru')); // true

  console.log(javaScriptGroup.getAll());