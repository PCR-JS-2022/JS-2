function createGroup(interest) {
  let members = [];
  const getAll = () => members;
  
  function onMember(person) {
    if (person.interests?.includes(interest) && 
    !people.map((p) => p.email).includes(person.email)){
        people.push(person);
        return true;
    }
    return false;
  }

  function offMember(email) {
    const index = people.findIndex((p) => p.email === email);
        if (index != -1){
            people.splice(index);
            return true;
        }
        return false;
    }
  return { getAll, onMember, offMember }
};

function testRange(tempDate, range) {
  return tempDate >= range.startDate && tempDate <= range.endDate;
}

function findMeetingMembers(group, meetingDate) {
  return (group.getAll && group.getAll()) && 
  (meetingDate instanceof Date) ? group
    .getAll()
    .filter((p) => testRange(meetingDate, p.freeRange))
    .length : 0;
};

function findMeetingDateWithMaximumMembers(group) {
  const members = group.getAll() && group.getAll();
  if (!members) return null;
  if (members.length === 1) return members[0].freeRange.startDate;

  const dates = members.map((x) => x.freeRange.startDate);
  let resultDate= startDates.sort((a, b) => a - b)[0];
  let maxPeople = 0;
  dates.forEach((date) => {const counter = members
    .filter((person) => isInRange(date, person.freeRange))
    .length;
    
    if (counter > maxPeople) {
        maxPeople = counter;
        resultDate = date;
    } });
  return resultDate;
};

module.exports = { createGroup, findMeetingMembers, findMeetingDateWithMaximumMembers };
