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
    let group = [];
    return{
        getAll(){
            return group;
        },
        includePerson(member){
            if (member.interests === undefined) return false;
            if (member.interests.includes(interest) && member.interests && !(group.includes(member))) {
                group.push(member);
                return true;
            }
            return false;
            
        },
        excludePerson(email){
            if (group.some(e => e.email === email)){
                group = group.filter(e => e.email !== email);
                return true;
            }
            else{
                return false;
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
    if(!meetingDate){ 
        return 0;
    }
    return (group.getAll.filter(e => e.freeRange.endDate >= meetingDate && e.freeRange.startDate <= meetingDate).length);

};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    
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
  javaScriptGroup.includePerson(phoneList[2]); // true
  javaScriptGroup.includePerson(phoneList[0]); // false
  javaScriptGroup.includePerson(phoneList[3]); // true

  console.log(javaScriptGroup.excludePerson('vasiliy@mail.ru')); // false
  javaScriptGroup.excludePerson('roman@yandex.ru'); // true

  console.log(javaScriptGroup.getAll());
