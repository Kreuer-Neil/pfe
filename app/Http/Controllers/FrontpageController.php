<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontpageController extends Controller
{
    function index()
    {
        return view('home'/*, compact('')*/);
    }

    public function policy()
    {
        return view('policy'/*, compact('')*/);
    }

    public function contact()
    {
        return view('policy');
    }
}
