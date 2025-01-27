import { DateTime } from "luxon";

export const getNowISO = () => DateTime.now().toISO();
