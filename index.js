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
    let friends = []

    function getAll() {
        return friends
    }

    function includePerson(friend) {
        if (!Array.isArray(friends) || !Array.isArray(friend.interests)) {
            return false
        }

        if (friends.includes(friend) || !friend.interests.includes(interest)) {
                return false
            } else {
                friends.push(friend)
                return true
            }
    }

    function excludePerson(email) {
        const friend = friends.find(friend => {
            if (friend.email == email) {
                return friend
            }
        })

        if (friend == undefined) {
            return false
        } else {
            friends.splice(friends.indexOf(friend), 1)
            return true
        }
    }

    return {
        getAll: getAll,
        includePerson: includePerson,
        excludePerson: excludePerson
    };
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (typeof group !== "object" || !(meetingDate instanceof Date)) {
        return 0
    }

    let amount = 0
    group.getAll().forEach(friend => {
        if (meetingDate >= friend.freeRange.startDate && meetingDate <= friend.freeRange.endDate) {
            amount += 1
        }
    })
    return amount
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (typeof group !== "object" || typeof group.getAll !== "function") {
        return null
    }

    const friends = group.getAll()

    if (friends.length == 0) {
        return null
    }

    let amount = 0
    let date = new Date()

    let startDate = friends.sort((firstFriend, secondFriend) => {
        return firstFriend.freeRange.startDate - secondFriend.freeRange.startDate
    })[0].freeRange.startDate

    let endDate = friends.sort((firstFriend, secondFriend) => {
        return secondFriend.freeRange.endDate - firstFriend.freeRange.endDate
    })[0].freeRange.endDate

    for (let i = startDate.getTime(); i <= endDate.getTime(); i += 86400000) {
        const findMembers = findMeetingMembers(group, new Date(i))
        if (findMembers > amount) {
            amount = findMembers
            date = new Date(i)
        }
    }

    if (amount != 0) {
        return date
    } else {
        return null
    }
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
