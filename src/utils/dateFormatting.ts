const timeReferenceMS = {
  get second(): number {return 1000},
  get minute(): number {return this.second * 60},
  get hour(): number {return this.minute * 60},
  get day(): number {return this.hour * 24},
  get week(): number {return this.day * 7},
  get month(): number {return this.day * 30},
  get year(): number {return this.day * 365},
};

export function timestampToMediumDate(timestamp: number | string): string {
  return new Intl.DateTimeFormat(
    'pt-BR',
    {year: 'numeric', month: 'short', day: 'numeric'},
  )
    .format(new Date(timestamp))
    .replace('.', '')
    .replace(/ de /g, ' ');
}

function getUnitOfTime(timeInMS: number): Intl.RelativeTimeFormatUnit {
  const { minute, hour, day, week, month, year } = timeReferenceMS;

  if (timeInMS < minute) return 'second';
  if ((timeInMS >= minute) && (timeInMS < hour)) return 'minute';
  if ((timeInMS >= hour) && (timeInMS < day)) return 'hour';
  if ((timeInMS >= day) && (timeInMS < week)) return 'day';
  if ((timeInMS >= week) && (timeInMS < month)) return 'week';
  if ((timeInMS >= month) && (timeInMS < year)) return 'month';
  return 'year';
}

export function msToResumedTime(timestamp: number | string): string {
  (typeof timestamp === 'number') &&
  (timestamp = Math.ceil(timestamp));
  (typeof timestamp === 'string') &&
  (timestamp = (new Date(timestamp)).getTime());

  const unit = getUnitOfTime(timestamp);
  return new Intl.RelativeTimeFormat(
    'pt-BR',
    {numeric: 'auto', style: 'narrow'},
  )
    .format(Math.ceil(timestamp / timeReferenceMS[unit]), unit)
    .replace('.', '')
    .replace(/^\D+(\d)/, '$1');
}
