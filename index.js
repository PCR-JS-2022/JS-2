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

/*
 class Group {
  constructor(groupName) {
      this.groupName = groupName; 
      this.inGroup = [];
      this.inGroupEmails = new Set();
  }

  isInGroup(person) {
      return this.inGroupEmails.has(person.email);
  }

  isEmailInGroup(email) {
      return this.inGroupEmails.has(email);
  }

  checkInterestGroup(person) {
      return person.interests.includes(this.groupName);
  }

  getAll() {
      return this.inGroup;
  }

  includePerson(person) {

    if (!this.isInGroup(person)&&this.checkInterestGroup(person)) {
        this.inGroup.push(person);
        this.inGroupEmails.add(person.email);
        return true;
    }
    return false;
  }

  excludePerson(email) {
      if (this.isEmailInGroup(email)) {
          this.removeByEmail(email);
          this.inGroupEmails.delete(email);
      }
      return false;
  }

  removeByEmail(email) {
      let toRemove = -1;
      this.inGroup.forEach(
          (el, ind) => {
              if (el.email == email) {
                  toRemove = ind;
              }
          }
      );
      if (toRemove != -1) this.inGroup.splice(toRemove, 1);
  }
}
*/

/**
 * @param {string} interest - интерес группы
 * @returns {Group} созданная группа
 */
function createGroup(interest) {
  //return new Group(interest);
  return {
    interest: interest,
    inGroup: [],
    inGroupEmails: new Set(),

    getAll() {
      return this.inGroup;
    },

    includePerson(person) {
      if (!person.interests.includes(interest)) return false;
      if (!this.inGroupEmails.has(person.email)) this.inGroup.push(person);
    },

    excludePerson(email) {
      if (!typeof email == 'string') return false;
      let toRemove = -1;
      this.inGroup.forEach(
        (el, ind) => {
          if (el.email == email) toRemove = ind;
        }
      );
      if (toRemove == -1) return false;
      this.inGroup.splice(toRemove, 1);
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
  if (!(meetingDate instanceof Date)) return 0;

  let numberOfPeople = 0;
  group.inGroup.forEach(
    (el, ind) => {
      if (checkDateIsInRange(meetingDate, el.freeRange.startDate, el.freeRange.endDate))
        numberOfPeople += 1;
    }
  );
  return numberOfPeople;
};

function checkDateIsInRange(givenDate, from, to) {
  return givenDate >= from && givenDate <= to;
}

/**
 * @typedef EndPointDate
 * @type {object}
 * @property {Date} date - дата
 * @property {string} sign - свойство, указывающее, является ли данная дата началом или концом отрезка
 */

class EndPointDate {
  constructor(date, endSign) {
    this.date = date;
    this.sign = endSign;
  }

  // начала отрезков при сортировке занимают места раньше, чем концы отрезков с такой же датой
  compareTo(another) {
    if (this.date == another.date && this.sing == another.sign) return 0;
    
    if (this.date == another.date) {
      if (this.sign == '+') return -1;
    }

    if (this.date > another.date) return 1;

    return -1;
  }
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
  //if (!(group instanceof Group)) return null;

  // опсиание алгоритма: https://cs.stackexchange.com/questions/105773/find-a-point-shared-by-maximum-segments
  // подготовка исходных данных

  // массив, содержащий концы промежутков дат
  let segmentEnds = [];

  // '+' обозначает дату, являющуюся началом промежутка, '-' - концом
  group.inGroup.forEach(
    (el, ind) => {
      segmentEnds.push(new EndPointDate(el.freeRange.startDate, '+'));
      segmentEnds.push(new EndPointDate(el.freeRange.endDate, '-'));
    }
  );

  // сотировка дат-концов проемежутков
  segmentEnds.sort(
    (first, second) => first.compareTo(second)
  );

  // работа алгоритма
  let intersectionCount = 0;
  let maxIntersection = 0;
  let bestDate = null;

  segmentEnds.forEach(
    (el, ind) => {
      if (el.sign == '+') {
        intersectionCount += 1;
      }
      if (el.sign == '-') {
        intersectionCount -= 1;
      }
      if (intersectionCount > maxIntersection) {
        maxIntersection = intersectionCount;
        bestDate = el.date;
      }
    }
  );
  
  return bestDate;
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

/*
const javaScriptGroup = createGroup('javascript');
javaScriptGroup.includePerson(phoneList[2]); // true
javaScriptGroup.includePerson(phoneList[0]); // false
javaScriptGroup.includePerson(phoneList[3]); // true

javaScriptGroup.excludePerson('vasiliy@mail.ru'); // false
javaScriptGroup.excludePerson('roman@yandex.ru'); // true

javaScriptGroup.getAll();
*/

/*
  [
    {
      name: 'Егор',
      interests: ['computers', 'javascript'],
      email: 'egor@gmail.ru',
      freeRange: {
        startDate: new Date('03.01.2020'),
        endDate: new Date('08.10.2020'),
      }
    },
  ]
*/

/*
const javaScriptGroup1 = createGroup('javascript');
javaScriptGroup1.includePerson(phoneList[2]); // true
javaScriptGroup1.includePerson(phoneList[3]); // true

findMeetingMembers(javaScriptGroup1, new Date('10.10.2020')); // 0
findMeetingMembers(javaScriptGroup1, new Date('06.10.2020')); // 2
*/


/*
const gamesGroup = createGroup('games');
gamesGroup.includePerson(phoneList[0]); // true
gamesGroup.includePerson(phoneList[1]); // true

findMeetingDateWithMaximumMembers(gamesGroup); // 02.05.2020
*/
