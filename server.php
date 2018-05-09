<?php

/*
 * (C) 2017 Ian Brehm
 * ------------------------------------------------
 * server.php handles all the client/server communications.
 * It handles communcations with more than the level editor.
*/

class Server {
	//------------------------------------------------------------------------------------------------------------------------------------------
	public function __construct() {
		if(!$this->is_ajax()) {
			return -1;
		}
		
		if (isset($_POST["action"]) && !empty($_POST["action"])) {
			
			$action = $_POST["action"];
			$response = "";
			
			switch($action) {
				
				case "level_save":
					$response = $this->save_level();
					break;
				case "level_load":
					$response = $this->load_level();
					break;
				case "level_list":
					$response = $this->level_list();
					break;
				default:
					$response = "nothing";
					break;
				
			}
			
			echo $response;
			return(0);
		}
		
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function is_ajax() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function save_level() {
	
		$rtrn = "";
		
		$lv_name = $_POST['lv_name'];
		$data = json_decode($_POST['data']);
		$data_write = "";
		$save_loc = $_POST['save_loc'];
		
		$total = count($data);
		
		
		for($i = 0; $i < $total; $i++) {
			$value = pack("c", $data[$i]);
			$data_write .=  $value;
		}
		file_put_contents($save_loc . $lv_name . ".bin", $data_write);
		
		return "Save successful. ";
		
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function load_level() {
		
		$lv_name = $_POST['lv_name'];
		$save_loc = $_POST['save_loc'];
		
		$response['message'] = "";
		
		$response['data'] = array();
		
		$file = $save_loc . $lv_name .".bin";
		
		$handle = fopen($file, "rb");
		
		if($handle != FALSE) {
			
			$count = 0;
			while(!feof($handle)) {
				$value = @unpack("c", fread($handle, 1));
				if($value != null) {
					$response['data'][] = $value[1];
				}
			}
			$count++;
		}
		fclose($handle);
		//$response['data'] = file_get_contents($file);
		
		$response['message'] = "Load successful.";
		
		return json_encode($response);
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function level_list() {
	
		$save_loc = $_POST['save_loc'];
	
		// Scan the entire director for ogg, mp3, wav
		$array = glob($save_loc . '*.{bin}', GLOB_BRACE);
		// Find the amount of files
		$length = count($array);
		// Send message back the list was obtained
		$response["message"] = "List obtained";
		
		// Create the string to hold the HTML as a blank string
		$response["list"] = array();
		
		// For loop to add all the songs, and removing the directory path
		
		$search = array($save_loc, ".bin");
		$replace = array("", "");
		
		for($i = 0; $i < $length; $i++) {
			// Keep on adding more <option>
			$response["list"][] = str_replace($search, $replace, $array[$i]);
		}
		
		// return the response
		return json_encode($response);
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
}

$server = new Server;












































?>
