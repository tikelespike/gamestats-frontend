export function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text
}

export function titleCase(str: string): string {
  var splitStr = str.toLowerCase().split(" ")
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(" ")
}
