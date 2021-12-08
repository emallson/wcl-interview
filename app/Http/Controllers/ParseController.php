<?php

namespace App\Http\Controllers;

use GrahamCampbell\ResultType\Success;
use GrahamCampbell\ResultType\Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\CachedParse;
use function array_merge;

class ParseController extends Controller
{

    public static $timeoutMinutes = 15;

    public static function latestParse($parses)
    {
        usort(
            $parses, function ($a, $b) {
                return $b['startTime'] - $a['startTime']; 
            }
        );
        return $parses[0];
    }

    public static function cachedParse(string $region, string $realm, string $character)
    {
        return CachedParse::where('region', $region)
            ->where('realm', $realm)
            ->where('character', $character)
            ->whereRaw('updated_at >= now() - interval \'' . self::$timeoutMinutes . '\' minute')
            ->pluck('data')
            ->first();
    }

    public static function persistParse(string $region, string $realm, string $character, mixed $data)
    {
        $cached = new CachedParse;
        $cached->region = $region;
        $cached->realm = $realm;
        $cached->character = $character;
        $cached->data = $data;
        $cached->save();
    }

    public static function loadParses(string $region, string $realm, string $character)
    {
        $response = Http::get(
            "https://www.warcraftlogs.com/v1/parses/character/$character/$realm/$region", [
            "includeCombatantInfo" => true,
            "api_key" => $_ENV['WCL_API_KEY']
            ]
        );

        if($response->ok()) {
            return Success::create($response->json());
        } else {
            return Error::create([ "reason" => $response->body(), "status" => $response->status() ]);
        }
    }


    public function latest(string $region, string $realm, string $character)
    {
        $result = self::cachedParse($region, $realm, $character);
        if($result != null) {
            Log::info("parse cache hit: $region $realm $character");
            return response()->json($result);
        }

        Log::info("parse cache miss: $region $realm $character");
        $result = self::loadParses($region, $realm, $character);
        if($result->error()->isDefined()) {
            return response()->json(array_merge([ "error" => true ], $result->error()->get()), 400);
        } 

        $data = $result->success()->get();
        if(count($data) == 0) {
            return response()->json(
                [
                "error" => true,
                "reason" => "no parses found"
                ], 404
            );
        }

        $data = self::latestParse($result->success()->get());

        self::persistParse($region, $realm, $character, $data);

        return response()->json($data);
    }
}
