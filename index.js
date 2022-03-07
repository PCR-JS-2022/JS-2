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
     let _interest = interest;
     let userList = [];
     return {
         getAll: function () {
             return userList;
         },
         includePerson: function (user) {
           if(user.interests === undefined)
           return false;
             if (CheckUser(user, _interest) && !userList.includes(user)) {
                 userList.push(user);
                 return true;
             }
             return false;
         },
         excludePerson: function (email) {
             if (CheckEmail(email, userList)) return true;
             return false;
         },
     };
 }
 
 function CheckUser(user, _interest) {
     for (var i = 0; i < user.interests.length; i++) {
         if (user.interests[i] === _interest) return true;
     }
     return false;
 }
 
 function CheckEmail(email, userList) {
     for (var i = 0; i < userList.length; i++) {
         if (userList[i].email === email) {
             userList.splice(i, 1);
             return true;
         }
     }
     return false;
 }
 
 function CheckDate(date, range) {
     return range.freeRange.startDate <= date && date <= range.freeRange.endDate;
 }
 
 /**
  * @param {Group} group - группа людей
  * @param {Date} meetingDate - дата встречи
  * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
  */
 function findMeetingMembers(group, meetingDate) {
     let count = 0;
     if(group === undefined)
     return 0;
     const localList = group.getAll();
     for (var i = 0; i < localList.length; i++) {
         if (CheckDate(meetingDate, localList[i])) count++;
     }
     return count;
 }
 
 /**
  * @param {Group} group - группа людей
  * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
  */
 function findMeetingDateWithMaximumMembers(group) {
   if(group === undefined)
   return null;
     let localList = group.getAll();
     let count = 0;
     let start = new Date('01.01.2000');
 
     const startDates = localList.map((x) => x.freeRange.startDate);
 
     startDates.forEach((date) => {
         const userCount = findMeetingMembers(group, date);
 
         if (userCount > count) {
             count = userCount;
             start = date;
         }
     });
     if (start === new Date('01.01.2000'))
     return null;
     return start;
 }
 
 module.exports = {createGroup,findMeetingMembers,findMeetingDateWithMaximumMembers,};
