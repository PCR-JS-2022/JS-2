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
		excludePerson: (email) => {
			if (persons.some(person => person.email === email)) {
				persons = persons.filter(person => person.email !== email)
				return true;
			}
			return false;
		}
	}
}

/**
 * @param {Group} group
 * @param {Date} meetingDate
 * @returns {number}
 */
function findMeetingMembers(group, meetingDate) {
	if (!meetingDate instanceof Date) {
		return 0;
	}

	return group.getAll().reduce((members, person) =>
		person.freeRange.startDate - meetingDate <= 0 && meetingDate - person.freeRange.endDate <= 0
			? members + 1
			: members, 0)
}

/**
 * @param {Group} group
 * @returns {Date}
 */
function findMeetingDateWithMaximumMembers(group) {
	return group.getAll()
		.reduce((accumulator, person) => {
			const currentCount = findMeetingMembers(group, person.freeRange.startDate);
			if (currentCount > accumulator.bestCount) {
				accumulator.bestCount = currentCount;
				accumulator.bestDate = person.freeRange.startDate;
			}
			return accumulator;
		}, { bestDate: null, bestCount: 0 })
		.bestDate;
}

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
