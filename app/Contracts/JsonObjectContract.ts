export type JsonValue = string | number | boolean

export interface JsonObjectContract {
  [k: string]: JsonValue | JsonValue[] | JsonObjectContract
}
