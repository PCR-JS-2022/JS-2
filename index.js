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
var z = javaScriptGroup.includePerson(phoneList[2]); // true
var a = javaScriptGroup.includePerson(phoneList[0]); // false
var b = javaScriptGroup.includePerson(phoneList[3]); // true
var c = javaScriptGroup.excludePerson('vasiliy@mail.ru'); // false
var d = javaScriptGroup.excludePerson('roman@yandex.ru'); // true
var res = javaScriptGroup.getAll();

console.log(z, a, b, c, d)
console.log(JSON.stringify(res));

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
