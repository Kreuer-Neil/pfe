<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SupportController extends Controller
{
    function index()
    {
        return view('home'/*, compact('navbarItems', 'footerItems')*/);
    }

    public function policy()
    {
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }

    public function contact()
    {
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }
    public function team()
    {
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }

    public function faq()
    {
        return view('policy'/*, compact('navbarItems', 'footerItems')*/);
    }
}
