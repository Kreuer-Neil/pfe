import {useLang} from "@/hooks/useLang";
import {useTranslation} from "react-i18next";

/**
 * Returns a Date object when a Laravel date is given.
 *
 * date valid format: 'YYYY-MM-dd hh:mm:ss'.
 */
export function laravelDateToJsDate(date: string): Date {
    let dateContainer = date.split(' ');
    let dateItem = [
        dateContainer[0].split('-'),
        dateContainer[1].split(':')
    ]
    return new Date(Date.UTC(
        Number(dateItem[0][0]),
        Number(dateItem[0][1]),
        Number(dateItem[0][2]),

        Number(dateItem[1][0]),
        Number(dateItem[1][1]),
        Number(dateItem[1][2]),
    ));
}

// TODO translate php-side and add prop with translated string to items instead ?

/**
 * Returns a translated string for the given date.
 */
export function upcomingDateToString(date: Date): string {
    const fullPath = 'translate_date_';
    // lang
    const {t} = useTranslation('date');

    // Now date
    const now = new Date(Date.now());

    // Given date time of the day
    const time: string = date.getHours() + ':' + date.getMinutes();
    //

    const day = date.getDate();
    const dayType = day <= 1 ? 'singular' : 'plural';
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    // Checks if day is this week
    if (date.getFullYear() === now.getFullYear()) {
        if (date.getMonth() === now.getMonth()) {
            if (date.getDate() === now.getDate()) {
                return t(fullPath + 'today', {
                    time: time,
                })
            }
            return t(fullPath + 'day', {
                dayOfWeek: t('day_' + dayOfWeek.toString()),
                day: day.toString(),
                dayType: t(dayType + '_day'),
                time: time,
            })
        }
        return t(fullPath + 'month', {
            dayOfWeek: t('day_' + dayOfWeek.toString()),
            day: day.toString(),
            dayType: t(dayType + '_day'),
            month: t('month_' + month.toString()),
            time: time,
        })
    }

    return t(fullPath + 'year', {
        day: day.toString(),
        dayType: t(dayType + '_day'),
        month: t('month_' + month.toString()),
        year: date.getFullYear(),
        time: time,
    });

}
