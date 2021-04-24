// Annotate your class with @Ignore and ApplicationProvider will not read it.

export function Ignore(): ClassDecorator {
  return target => {
    target.prototype.ignore = true
  }
}
