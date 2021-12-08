<?php

namespace App\Http\Controllers;

use GrahamCampbell\ResultType\Success;
use GrahamCampbell\ResultType\Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use function array_merge;

class ParseController extends Controller
{

    public static function latestParse($parses)
    {
        usort(
            $parses, function ($a, $b) {
                return $b['startTime'] - $a['startTime']; 
            }
        );
        return $parses[0];
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
        $result = self::loadParses($region, $realm, $character);
        if($result->success()->isDefined()) {
            return response()->json(self::latestParse($result->success()->get()));
        } else {
            return response()->json(array_merge([ "error" => true ], $result->error()->get()), 400);
        }
    }
}
