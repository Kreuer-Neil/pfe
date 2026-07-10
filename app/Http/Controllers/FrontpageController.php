<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontpageController extends Controller
{
    public array $navbarItems = [
        'index',
        'policy',
//        'contact', // With support in contact
    ];
    public array $footerItems = [
        [
            'name' => 'app',
            'items' => [
                'home',
//                'features',
//                'app',
            ]
        ],
        [
            'name' => 'about',
            'items' => [
//                'team',
//                'contact',
                'policy',
            ]
        ],
        /*[
            'name' => 'support',
            'items' => [
                'support',
                'FAQ',
            ]
        ],*/
    ];

    function index()
    {
        return view('home');
    }

    public function policy()
    {
        return view('policy');
    }

    public function contact()
    {
        return redirect(route('frontpage.index'));
        return view('policy', compact('navbarItems', 'footerItems'));
    }

    public function team()
    {
        return redirect(route('frontpage.index'));
        return view('policy', compact('navbarItems', 'footerItems'));
    }
}
