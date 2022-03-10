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
  const friends = [];

  return {
    getAll: () => {
      return friends;
    },

    includePerson: (friend) => {
      let friendResult = false;
        if (friend.interests?.includes(interest)) {
          if(friends.length) {
            let friendExist = false;
            friends.forEach(item => {
               if (item.email == friend.email ) {
                  friendExist = true;
               }
            })
            if(!friendExist) {
              friendResult = true;
              friends.push(friend);
            }
          } else {
              friendResult = true;
              friends.push(friend);
          }
        }
      return friendResult;
    },


    excludePerson: (email) => {
      let emailResult = false;
      friends.forEach(friend => {
        if (friend.email === email) {
          friends.splice(friend, 1);
          emailResult = true;
        } else {
          emailResult = false;
        }
      })
      return emailResult;
    }
  }
};


/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
  if (!group.getAll || !meetingDate instanceof Date) {
    return 0;
  }

  const member = group.getAll().filter((item) => item.freeRange.startDate <= meetingDate && meetingDate <= item.freeRange.endDate);
  return member.length;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
 function findMeetingDateWithMaximumMembers(group) {
  if (!group.getAll) {
    return null;
  }

  const allMemebers = group.getAll();
  let bestOfDay = null;
  let maxPerson = 0;

  allMemebers.map((eachMember) => {
    let startDate = eachMember.freeRange.startDate;
    let sumOfMemebers = findMeetingMembers(group, startDate);

    if (sumOfMemebers > maxPerson) {
      maxPerson = sumOfMemebers;
      bestOfDay = startDate;
    }
  });

  return bestOfDay;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
