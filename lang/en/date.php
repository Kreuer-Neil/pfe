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
        '1' => 'January',
        '2' => 'February',
        '3' => 'March',
        '4' => 'April',
        '5' => 'May',
        '6' => 'June',
        '7' => 'July',
        '8' => 'August',
        '9' => 'September',
        '10' => 'October',
        '11' => 'November',
        '12' => 'December',
    ],
    'translatable_date' => [
        'today' => 'Today at {time}',
        'day' => '{dayOfWeek} {day}, at {time}',
        'month' => '{dayOfWeek} {day}{dayType} {month}, at {time}',
        'year' => '{day}{dayType} {month} {year}, at {time}',
    ]
];
