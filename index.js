/**
 * @typedef Person
 * @type {object}
 * @property {string} name
 * @property {Array<string>} interests
 * @property {string} email
 * @property {{ startDate: Date, endDate: Date }} freeRange
 */

/**
 * @typedef Group
 * @type {object}
 * @property {() => Array<Person>} getAll
 * @property {(person: Person) => boolean} includePerson
 * @property {(email: string) => boolean} excludePerson
 */

/**
 * @param {string} interest
 * @returns {Group}
 */
function createGroup(interest) {
	let persons = [];
	return {
		getAll: () => persons,
		includePerson: (person) => {
			if (person.interests.includes(interest)) {
				persons.push(person);
				return true;
			}
			return false;
		},
		excludePerson: (person) => {
			if (persons.includes(person)) {
				persons = persons.filter(p => p !== person)
				return true;
			}
			return false;
		}
	}
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {

}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {

}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
