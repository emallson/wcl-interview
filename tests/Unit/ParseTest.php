<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use function file_get_contents;
use function json_decode;
use App\Http\Controllers\ParseController;
use function json_encode;

class ParseTest extends TestCase
{
    private $data;

    protected function setUp(): void
    {
        $this->data = json_decode(file_get_contents("tests/Unit/test_data.json"), true);
    }

    public function test_get_latest()
    {
        $latest = ParseController::latestParse($this->data);

        foreach ($this->data as $parse) {
            $this->assertGreaterThanOrEqual($parse['startTime'], $latest['startTime'], 'The latest parse should be maximal.');
        }
    }
}
