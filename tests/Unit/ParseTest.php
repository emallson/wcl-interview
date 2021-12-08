<?php

namespace Tests\Unit;

use Tests\TestCase;
use function file_get_contents;
use function json_decode;
use App\Http\Controllers\ParseController;
use function json_encode;
use Illuminate\Support\Facades\Http;

class ParseTest extends TestCase
{
    private $data;

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = json_decode(file_get_contents("tests/Unit/test_data.json"), true);
    }

    public function test_latestParse()
    {
        $latest = ParseController::latestParse($this->data);

        foreach ($this->data as $parse) {
            $this->assertGreaterThanOrEqual($parse['startTime'], $latest['startTime'], 'The latest parse should be maximal.');
        }
    }

    public function test_loadParses_failure()
    {
        Http::fake(['*' => Http::response('invalid request', 400)]);

        $response = ParseController::loadParses('US', 'Turalyon', 'Eisenpelz');

        $this->assertTrue($response->error()->isDefined());
        $err = $response->error()->get();
        $this->assertEquals('invalid request', $err['reason']);
        $this->assertEquals(400, $err['status']);
    }

    public function test_loadParses_success()
    {
        Http::fake(
            [
            'warcraftlogs.com/v1/parses/character/Eisenpelz/Turalyon/US*' => Http::response($this->data, 200),
            '*' => Http::response('invalid request', 400)
            ]
        );

        $response = ParseController::loadParses('US', 'Turalyon', 'Eisenpelz');
        $this->assertTrue($response->success()->isDefined());
        $val = $response->success()->get();
        $this->assertEquals($this->data, $val);
    }

    public function test_latest()
    {
        Http::fake(
            [
            'warcraftlogs.com/v1/parses/character/Eisenpelz/Turalyon/US*' => Http::response($this->data, 200),
            '*' => Http::response('invalid request', 400)
            ]
        );

        $response = $this->get('/api/parse/latest/US/Turalyon/Eisenpelz');

        $response->assertStatus(200)->assertJson(
            [
            "characterName" => "Eisenpelz",
            "class" => "Monk",
            "encounterName" => "Guardian of the First Ones"
            ]
        );
    }
}
