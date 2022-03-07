"use strict";
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
        getAll() {
            return friends;
        },
        includePerson(friend) {
            if (friend.interests === undefined) {
                return false;
            }
            if (friend.interests.includes(interest) && !friends.includes(friend)) {
                friends.push(friend);
                return true;
            }
            return false;
        },
        excludePerson(email) {
            const filteredFriends = friends.filter((e) => {
                if (e.email !== email) {
                    return e;
                }
            });
            if (friends.length > filteredFriends.length) {
                return true;
            } 
            return false;
        }
    }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!(Boolean(group.getAll) || meetingDate instanceof Date)) return 0;
    const friends = group.getAll();
    let freeFriendsCount = 0;
    friends.forEach((e) => {
        if (meetingDate >= e.freeRange.startDate && meetingDate <= e.freeRange.endDate) freeFriendsCount += 1;
    });
    return freeFriendsCount;
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!(Boolean(group.getAll))) return null;
    const friends = group.getAll();
    let maxFriends = 1;
    let date;
    friends.forEach((e) => {
        const currDate = e.freeRange.startDate;
        const currMax = findMeetingMembers(group, currDate);
        console.log(currMax);
        if (currMax > maxFriends) {
            maxFriends = currMax;
            date = e.freeRange.startDate;
        }
    }); 
    if (maxFriends === 1) return null;
    return date;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
