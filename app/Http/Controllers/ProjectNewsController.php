<?php

namespace App\Http\Controllers;

use App\Http\Resources\Project\ProjectContextResource;
use App\Http\Resources\ProjectNewsResource;
use App\Models\Project;
use Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectNewsController extends Controller
{
    public function index(Request $request, Project $project)
    {
        if (! Gate::allows('view', $project)) {
            abort(404, __('project_not_found'));
        }

        $news = $project->news()->with('author')->paginate(10);

        return Inertia::render('projects/news', [
            'project' => array_merge(
                (new ProjectContextResource($project))->toArray($request),
                ['can_create_news' => Gate::allows('createNews', $project)]
            ),
            'news' => ProjectNewsResource::collection($news)->toArray($request),
            'newsNextPage' => $news->currentPage() < $news->lastPage() ? $news->currentPage() + 1 : null,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'text_content' => 'required|string|min:3|max:2000',
        ]);

        $project->news()->create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'text_content' => $validated['text_content'],
        ]);

        return redirect()->back();
    }

    public function destroy(Project $project, int $news)
    {
        $newsItem = $project->news()->findOrFail($news);

        Gate::authorize('deleteNews', [$project, $newsItem]);

        $newsItem->delete();

        return redirect()->back();
    }
}
