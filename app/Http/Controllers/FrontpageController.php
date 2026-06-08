<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontpageController extends Controller
{
    /*public array $navbarItems = [
        'index',
        'policy', // Or support, TODO see what tu put here
        'contact',
    ];
    public array $footerItems = [
        [
            'name' => 'app',
            'items' => [
                'home',
                'features',
                'app',
            ]
        ],
        [
            'name' => 'about',
            'items' => [
                'team',
                'contact',
                'policy',
            ]
        ],
        [
            'name' => 'support',
            'items' => [
                'support',
                'FAQ',
            ]
        ],
    ];*/

    function index()
    {
        return view('home'/*, compact('navbarItems', 'footerItems')*/);
    }

    // TODO re-set to default
    public function policy()
    {
        return redirect(route('frontpage.index'));
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }

    public function contact()
    {
        return redirect(route('frontpage.index'));
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }
    public function team()
    {
        return redirect(route('frontpage.index'));
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }
}
