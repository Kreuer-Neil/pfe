import {TFunction} from "i18next";

/**
 * Returns a Date object when a Laravel date is given.
 *
 * Accepts either a plain 'YYYY-MM-dd hh:mm:ss' string (from fields without a `datetime`
 * cast, sent as the raw DB value - assumed UTC) or an ISO 8601 string (from fields with a
 * `datetime` cast, which Carbon serializes to JSON that way - already carries its own
 * offset/'Z', so it's handed straight to the native Date parser instead).
 */
export function laravelDateToJsDate(date: string): Date {
    if (date.includes('T')) {
        return new Date(date);
    }

    const dateContainer = date.split(' ');
    const dateItem = [
        dateContainer[0].split('-'),
        dateContainer[1].split(':')
    ]
    return new Date(Date.UTC(
        Number(dateItem[0][0]),
        Number(dateItem[0][1]) -1,
        Number(dateItem[0][2]),

        Number(dateItem[1][0]),
        Number(dateItem[1][1]),
        Number(dateItem[1][2]),
    ));
}

// TODO translate php-side and add prop with translated string to items instead !!!

/**
 * Returns a translated string for the given date.
 *
 * `t` must come from `useTranslation('date')` in the calling component - this is a plain
 * function, not a hook, so it can safely be called from loops/callbacks (e.g. inside `.map()`).
 */
export function upcomingDateToString(date: Date, t: TFunction): string {
    const now = new Date();
    const sameYear = date.getFullYear() === now.getFullYear();
    const sameMonth = sameYear && date.getMonth() === now.getMonth();
    const sameDay = sameMonth && date.getDate() === now.getDate();

    const time = date.getHours() + ':' + (0 + date.getMinutes().toString()).slice(-2);

    if (sameDay) {
        return t('translate_date_today', {time});
    }

    const params: Record<string, string | number> = {
        day: date.getDate().toString(),
        dayType: t((date.getDate() <= 1 ? 'singular' : 'plural') + '_day'),
        time,
    };

    if (sameYear) {
        params.dayOfWeek = t('day_' + date.getDay());
    }
    if (!sameMonth) {
        params.month = t('month_' + date.getMonth());
    }
    if (!sameYear) {
        params.year = date.getFullYear();
    }

    return t('translate_date_' + (sameYear ? (sameMonth ? 'day' : 'month') : 'year'), params);
}
