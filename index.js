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
	return {
		_group: [],

		getAll: function () {
			return this._group
		},

		includePerson: function (newPerson) {
			if (!newPerson || !newPerson.interests) return false

			const inGroup = this._group.some(person => person.email === newPerson.email)
			const personHasInterest = newPerson.interests.some(i => i === interest)

			if (!inGroup && personHasInterest) {
				this._group.push(newPerson)
				return true
			}
			return false
		},

		excludePerson: function (email) {
			const prevLength = this._group.length
			this._group = this._group.filter(person => person.email !== email)

			return this._group.length !== prevLength
		}
	}
}

/**
 * @param {Group} group - группа людей
 * @param {Date} meetingDate - дата встречи
 * @returns {number} кол-во людей, готовых в переданную дату посетить встречу
 */
function findMeetingMembers(group, meetingDate) {
	if (!isGroup(group) || !(meetingDate instanceof Date)) {
		return 0
	}
	return group.getAll().reduce((count, person) => {
		if (dateInRange(meetingDate, person.freeRange)) {
			count++
		}
		return count
	}, 0)
}

/**
 * @param {Group} group - группа людей
 * @returns {Date} дата, в которую могут собраться максимальное кол-во человек из группы
 */
function findMeetingDateWithMaximumMembers(group) {
	if (!isGroup(group) || group.getAll().length === 0) return null

	const startingDates = group.getAll()
		.map(person => person.freeRange.startDate)
		.sort((a, b) => a - b)

	const resultObj = startingDates.reduce((result, date) => {
		let personCount = 0
		group.getAll().forEach(person => {
			if (dateInRange(date, person.freeRange)) {
				personCount++
			}
		})
		if (personCount > result.personCount) {
			return { date, personCount }
		}
		return result
	}, { date: new Date(), personCount: 0 })

	return resultObj.date
}

/**
 * @param {any} group - объект, который необходимо проверить, является ли он Group
 * @returns {boolean} - результат проверки
 */
function isGroup(group) {
	return (
		typeof group === 'object' ||
		group.hasOwnProperty('getAll') ||
		group.hasOwnProperty('includePerson') ||
		group.hasOwnProperty('excludePerson')
	)
}

/**
 * @param {Date} date - Дата, которую нужно проверить, входит ли она в промежуток
 * @param {{ startDate: Date, endDate: Date }} range - указанный промежуток
 * @returns {boolean} - результат проверки
 */
function dateInRange(date, range) {
	return date >= range.startDate && date <= range.endDate
}

module.exports = {createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers};
