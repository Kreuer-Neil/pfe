<?php
return [
    'no_time_limit' => 'No time limit', // or no deadline
    'day' => [
        '0' => 'Sunday',
        '1' => 'Monday',
        '2' => 'Tuesday',
        '3' => 'Wednesday',
        '4' => 'Thursday',
        '5' => 'Friday',
        '6' => 'Saturday',
    ],
    'dayType' => [
        'singular' => 'st',
        'plural' => 'th',
    ],
    'month' => [
        '0' => 'January',
        '1' => 'February',
        '2' => 'March',
        '3' => 'April',
        '4' => 'May',
        '5' => 'June',
        '6' => 'July',
        '7' => 'August',
        '8' => 'September',
        '9' => 'October',
        '10' => 'November',
        '11' => 'December',
    ],
    'translatable_date' => [
        'today' => 'Today at {time}',
        'day' => '{dayOfWeek} {day}, at {time}',
        'month' => '{dayOfWeek} {day}{dayType} {month}, at {time}',
        'year' => '{day}{dayType} {month} {year}, at {time}',
    ]
];
