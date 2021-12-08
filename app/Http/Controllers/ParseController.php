<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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


    public function latest(string $region, string $realm, string $character)
    {
        $response = Http::get(
            "https://www.warcraftlogs.com/v1/parses/character/$character/$realm/$region", [
            "includeCombatantInfo" => true,
            "api_key" => $_ENV['WCL_API_KEY']
            ]
        );

        if($response->ok()) {
            return response()->json(self::latestParse($response->json()));
        } else {
            return response()->json([ "error" => true, "reason" => $response->body(), "status" => $response->status()], 400);
        }
    }
}
