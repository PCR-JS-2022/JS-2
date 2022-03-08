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
var z = javaScriptGroup.includePerson(phoneList[2]); // true
var a = javaScriptGroup.includePerson(phoneList[0]); // false
var b = javaScriptGroup.includePerson(phoneList[3]); // true
var c = javaScriptGroup.excludePerson('vasiliy@mail.ru'); // false
var d = javaScriptGroup.excludePerson('roman@yandex.ru'); // true
var res = javaScriptGroup.getAll();

console.log(z, a, b, c, d)
console.log(JSON.stringify(res));
*/

/*
const javaScriptGroup = createGroup('javascript');
var a = javaScriptGroup.includePerson(phoneList[2]); // true
var b = javaScriptGroup.includePerson(phoneList[3]); // true

var c = findMeetingMembers(javaScriptGroup, new Date('10.10.2020')); // 0
var d = findMeetingMembers(javaScriptGroup, new Date('06.10.2020')); // 2
console.log(a, b, c, d);*/

const gamesGroup = createGroup('games');
var a = gamesGroup.includePerson(phoneList[0]); // true
var b = gamesGroup.includePerson(phoneList[1]); // true

var c = findMeetingDateWithMaximumMembers(gamesGroup); // 02.05.2020

console.log(a, b, JSON.stringify(c));
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
