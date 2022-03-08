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
        let insertFriend = friends.some((f) => f.email == friend.email)
        let interestFriend = friend.interests.includes(interest)
        if (insertFriend || !interestFriend) {
            return false
        } 
        friends.push(friend)
        return true
    }
    function excludePerson(email) {
        const checkEmail = friends.filter((friend) => (friend.email != email) )
        if(friends.length > checkEmail.length ) 
            return true
        else 
            return false
    } 
    return { getAll, includePerson, excludePerson }
};

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу 
 */
function findMeetingMembers(group, meetingDate) {
    if (!(meetingDate instanceof Date || group.getAll))
        return 0 
    let friends = group.getAll()
    friends.filter((friend) => {
        startDate = meetingDate >= friend.freeRange.startDate 
        endDate = meetingDate <= friend.freeRange.endDate
        if (startDate && endDate)
            return true
        else
            return false
    }
    )
    return friends.length
};

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
    if (!group.getAll) 
        return null
    let friends = group.getAll()
    let bestDate = null
    friends.map((friend) => {
        let date = friend.freeRange.startDate
        let countMembers = findMeetingMembers(group, friend.freeRange.startDate)
        if (countMembers > maximumMembers) {
            bestDate = date
            maximumMembers = countMembers
        }
    })
    return bestDate
};


module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };