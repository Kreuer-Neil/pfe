<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectNewsFeedResource;
use App\Models\ProjectNews;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $news = ProjectNews::whereIn('project_id', $user->feedProjectIds())
            ->with(['project', 'author'])
            ->latest()
            ->paginate(20);

        $user->markFeedVisited();

        return Inertia::render('feed', [
            'news' => ProjectNewsFeedResource::collection($news)->toArray($request),
            'newsNextPage' => $news->currentPage() < $news->lastPage() ? $news->currentPage() + 1 : null,
        ]);
    }
}
