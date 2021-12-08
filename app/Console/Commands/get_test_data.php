<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use function file_put_contents;

class get_test_data extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:get_test_data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download test data from the API';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $response = Http::get(
            'https://www.warcraftlogs.com/v1/parses/character/Eisenpelz/Turalyon/US', [
            'api_key' => $_ENV["WCL_API_KEY"]
            ]
        );

        if(!$response->ok()) {
            echo($response->body());
            return Command::FAILURE;
        }

        file_put_contents("tests/Unit/test_data.json", $response->body());

        return Command::SUCCESS;
    }
}
