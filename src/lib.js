export const dateFormat = (date) => {
  const now  = new Date(Date.now());
  date = new Date(date);

  const delay = now.getTime() - date.getTime();

  if(delay <= 60 * 1000) return '刚刚';

  if(delay <= 60 * 60 * 1000) return `${Math.floor(delay / (60 * 1000))} 分钟前`;

  const isThisYear = (date.getFullYear() === now.getFullYear());

  if(isThisYear) return `${date.getMonth()}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;

  return `${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
};
