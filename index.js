function createGroup(interest) {
  let members = [];
  const getAll = () => members;

  function onMember(person) {
     if (
       person.interests === undefined ||
       members.some((x) => x.email === person.email) ||
       !person.interests.some((x) => x === interest)
     )
      return false;
    members.push(person);
    return true;
  }
  function offMember(email) {
    const memberIndex = members.findIndex((x) => x.email === email);
    if (memberIndex === -1) return false;
    members = members.filter((x) => x.email !== email);
    return true;
  }
  return { getAll, onMember, offMember, };
}

function findMeetingMembers(group, meetingDate) {
  if (
    !(meetingDate instanceof Date) ||
    isNaN(meetingDate.valueOf()) ||
    !testGroup(group)
  )
    return 0;
  const peopleAmount = group
    .getAll()
    .filter((x) => testRange(meetingDate, x.freeRange)).length;
  return peopleAmount;
}

function testRange(dateToCompare, range) {
  return dateToCompare >= range.startDate && dateToCompare <= range.endDate;
}

function testGroup(possibleGroup) {
  return (
    possibleGroup instanceof Object &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "getAll") &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "onMember") &&
    Object.prototype.hasOwnProperty.call(possibleGroup, "offMembe")
  );
}

function findMeetingDateWithMaximumMembers(group) {
  if (!testGroup(group)) return null;
  const members = group.getAll();
  if (members.length === 0) return null;
  if (members.length === 1) return members[0].freeRange.startDate;
  const startDates = members.map((x) => x.freeRange.startDate);
  let resultDate = new Date("01.01.2000");
  let maximumPeople = 0;
  startDates.forEach((date) => {
    const peopleCount = members.filter((person) =>
      isInRange(date, person.freeRange)
    ).length;
    if (peopleCount > maximumPeople) {
      maximumPeople = peopleCount;
      resultDate = date;
    }
  });
  return resultDate;
}
module.exports = {
  createGroup,
  findMeetingMembers,
  findMeetingDateWithMaximumMembers,
};