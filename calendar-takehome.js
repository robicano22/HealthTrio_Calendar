const greeting = `Welcome to the Calendar!  You can add events, remove them, and print the week's remaining events.
\nTo Add An Event, please include a date, start time, end time, and description according to the following formats:\nDate: 'February 20' || Start Time: 7:00 AM || End Time: 12:00 PM || Description: 'string'
\nTo Remove an event, please include the date and start time in the same format as previous.`;

class Calendar {
  constructor() {
    this.schedule = [];
    this.dayDict = {
      1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday',
    };
    this.initiated = Date.now();
    console.log(greeting);
  }

  isValidDate(d) {
    d = new Date(d);
    return d instanceof Date && !isNaN(d);
  }

  generateTimestamps(eventDateMS, today, day, start) {
    // Divide by 8.64e7 here to ensure that the new event gets inserted to the proper array index
    const schedPosition = Math.floor((eventDateMS - today) / 8.64e+7) + 1;
    const startTime = new Date(`${day} ${start}`);
    const startTimeMS = startTime.getTime();
    return [schedPosition, startTimeMS];
  }

  generateEventDateStamp(day) {
    const eventDate = `${day}, 2020 00:00:00`;
    const eventDateMS = Date.parse(eventDate);
    return eventDateMS;
  }

  // Add Event - insertion time is O(1)
  addEvent(day, start, end, description) {
    const today = new Date();
    let eventDate = `${day}, 2020 00:00:00`;
    if (!this.isValidDate(eventDate)) return 'Must enter a valid date: i.e. \'February 20\'';
    const eventDateMS = this.generateEventDateStamp(day);
    eventDate = new Date(eventDate);
    const dayOfWeek = this.dayDict[eventDate.getDay(eventDate)];
    const [schedPosition, startTimeMS] = this.generateTimestamps(eventDateMS, today, day, start);
    day = `${dayOfWeek}, ${day} 2020`;
    const event = {
      Date: day, 'Start Time': start, 'End Time': end, Description: description,
    };

    if (!this.schedule[schedPosition]) {
      this.schedule[schedPosition] = {};
      this.schedule[schedPosition][startTimeMS] = event;
    } else this.schedule[schedPosition][startTimeMS] = event;
  }

  // Remove Event - O(1)
  removeEvent(day, start) {
    const now = new Date();
    const eventDateMS = this.generateEventDateStamp(day);
    const [schedPosition, startTimeMS] = this.generateTimestamps(eventDateMS, now, day, start);
    delete this.schedule[schedPosition][startTimeMS];
  }

  // Print Remaining - O(n).  I needed triple nested for loops to first iterate through the remaining days of the week, secondly to iterate
  // through the object representing each day, and lastly another loop to iterate through each event's detail properties.  So, it's effectively
  // still constant time because I don't iterate over anything twice.  Not the cleanest to read, but not time costly either.
  printRemainingAgendaForTheWeek() {
    const today = Date.now();
    const startPosition = Math.floor((today - this.initiated) / 8.64e+7);
    for (let i = startPosition; i < startPosition + 7; i += 1) {
      if (this.schedule[i]) {
        const eventsForToday = Object.entries(this.schedule[i]);
        for (let j = 0; j < eventsForToday.length; j += 1) {
          const details = Object.entries(eventsForToday[j][1]);
          for (let k = 0; k < details.length; k += 1) {
            console.log(`${details[k][0]}: ${details[k][1]}`);
          }
          console.log('\n');
        }
      }
    }
  }
}
