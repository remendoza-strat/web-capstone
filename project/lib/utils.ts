// Remove tags from input
export function StripHTML(html: string): string{
  return html.replace(/<[^>]+>/g, "").trim();
}

// Format date for display
export function DateTimeFormatter(date: Date | string | null): string{
  if(!date) return "Unknown date";
  
  const d = new Date(date);

  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const phTime = new Date(utc + 8 * 60 * 60 * 1000);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[phTime.getMonth()];
  const day = phTime.getDate();
  const year = phTime.getFullYear();

  let hours = phTime.getHours();
  const minutes = phTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${day}, ${year} at ${hours}:${paddedMinutes}${ampm}`;
}