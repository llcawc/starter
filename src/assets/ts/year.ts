/**
 * @name year
 * @description Set the current year to first copyright on page.
 */
export default function year(): void {
  const year: HTMLSpanElement | null = document.querySelector('.year')
  if (year) year.innerHTML = new Date().getFullYear().toString()
}
