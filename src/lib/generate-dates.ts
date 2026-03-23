import dayjs from 'dayjs';

export function currentMonthDates(count: number) {
  const today = dayjs();
  const dates = [];
  
  for (let i = 1; i <= count; i++) {
    dates.push({
      date: today.date(i).format('YYYY-MM-DD'),
      text: today.date(i).date(),
      isToday: today.date(i).isSame(today, 'day'),
      isCurrentMonth: true,
    });
  }
  
  return dates;
}

export function nextMonthDates(count: number) {
  const nextMonth = dayjs().add(1, 'month');
  const dates = [];
  
  for (let i = 1; i <= count; i++) {
    dates.push({
      date: nextMonth.date(i).format('YYYY-MM-DD'),
      text: nextMonth.date(i).date(),
      isToday: false,
      isCurrentMonth: false,
    });
  }
  
  return dates;
}

export function previousMonthDates(count: number) {
  const prevMonth = dayjs().subtract(1, 'month');
  const dates = [];
  
  for (let i = 1; i <= count; i++) {
    dates.push({
      date: prevMonth.date(i).format('YYYY-MM-DD'),
      text: prevMonth.date(i).date(),
      isToday: false,
      isCurrentMonth: false,
    });
  }
  
  return dates;
}
