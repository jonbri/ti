export interface RawItem {
  name: string;
  birthday: string;
  death?: string;
  hide?: boolean;
}

export interface Item extends RawItem {
  formattedAge: string;
  daysUntilBirthday: number;
}
