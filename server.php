<?php

class AutoNum {
	private $value = -1;
	
	public function Next() {
		$this->value++;
		return($this->value);
	}
}
$AutoNum = new AutoNum;

define("STAT_hp", $AutoNum->Next());
define("STAT_np", $AutoNum->Next());
define("STAT_str", $AutoNum->Next());
define("STAT_vit", $AutoNum->Next());
define("STAT_intel", $AutoNum->Next());
define("STAT_mnd", $AutoNum->Next());

define("STAT_atk", $AutoNum->Next());
define("STAT_def", $AutoNum->Next());
define("STAT_acc", $AutoNum->Next());
define("STAT_eva", $AutoNum->Next());

define("STAT_haste", $AutoNum->Next());
define("STAT_fire_def", $AutoNum->Next());
define("STAT_ice_def", $AutoNum->Next());
define("STAT_wind_def", $AutoNum->Next());
define("STAT_earth_def", $AutoNum->Next());
define("STAT_lightning_def", $AutoNum->Next());
define("STAT_water_def", $AutoNum->Next());
define("STAT_light_def", $AutoNum->Next());
define("STAT_dark_def", $AutoNum->Next());

define("STAT_total", $AutoNum->Next());

function rawPost() {

	return file_get_contents("php://input");

}

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
				
				case "item_save":
					$response = $this->item_save();
					break;
				case "item_list":
					$response = $this->item_list();
					break;
				case "item_get":
					$response = $this->item_get();
					break;
				case "pack_items":
					$response = $this->pack_items();
					break;
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
	private function item_save() {
		$error = false;
		$rtrn = array();
		
		$stuff = json_decode($_POST['data']);
	
		$length = count($stuff);
		$data_write = "";
		
		$id = $stuff[0]->value;
		
		for($i = 0; $i < $length; $i++) {
			$cur_length = 0;
			
			if($stuff[$i]->name == "STAT_name" || $stuff[$i]->name == "STAT_desc") {
			
				$cur_length = strlen($stuff[$i]->value);
				$data_write .= pack("C", $cur_length);
				
				$data_write .= $stuff[$i]->value;
				
			} else {
			
				if(is_numeric($stuff[$i]->value)) {
					$cur_length = 4;
					$data_write .= pack("C", $cur_length);
				
					$data_write .=  pack("i", $stuff[$i]->value);
				} else {
					$error = true;
				}
			}
			
			
		}
		
		if($error == true) {
			$rtrn[] = -2;
			$rtrn[] = "There is an error in the data.";
		} else {
			if($id == -1) {
				$max_id = file_get_contents("./items/meta.txt");
				$rtrn[] = $max_id;
				
				file_put_contents("./items/" . $max_id . ".bin", $data_write);
				$max_id++;
				
				file_put_contents("./items/meta.txt", $max_id);
				$rtrn[] = "Item successfully created.";
			} else {
				file_put_contents("./items/" . $id . ".bin", $data_write);
				$rtrn[] = $id;
				$rtrn[] = "Item successfully edited.";
			}
		}
		
		$rtrn = json_encode($rtrn);
		return $rtrn;
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function item_list() {
	
		$weapon_data = array();
		$armor_data = array();
		$consume_data = array();
		$material_data = array();
		$spell_data = array();
	
		$count = file_get_contents("./items/meta.txt");
		
		$until = $count;
		
		$names = array();
		
		for($i = 0; $i < $until; $i++) {
		
			$file = "./items/" . $i . ".bin";
			
			$handle = fopen($file, "rb");
			if($handle != FALSE) {
				
				// Skip the first 6 bytes (Which is the ID(4 bytes), ID size (1 byte), and type size (1 byte)).
				// We skip it since we already know the type is 4 bytes, and the name and name size comes right after.
				fseek($handle, 6, SEEK_CUR);
				
				$type = unpack("i", fread($handle, 4));
				
				$length = unpack("C", fread($handle, 1));
				$name = fread($handle, $length[1]);
				
				switch($type[1]) {
					case 0:
						$weapon_data[] = $i;
						$weapon_data[] = $name;
						break;
					case 1:
						$armor_data[] = $i;
						$armor_data[] = $name;
						break;
					case 2:
						$consume_data[] = $i;
						$consume_data[] = $name;
						break;
					case 3:
						$material_data[] = $i;
						$material_data[] = $name;
						break;
					case 4:
						$spell_data[] = $i;
						$spell_data[] = $name;
						break;
				}
			
			}
			fclose($handle);
		
		}
		
		$size = count($weapon_data);
		for($i = 0; $i < $size; $i+=2) {
			$names[] = $weapon_data[$i];
			$names[] = $weapon_data[$i+1];
		}
		
		$size = count($armor_data);
		for($i = 0; $i < $size; $i+=2) {
			$names[] = $armor_data[$i];
			$names[] = $armor_data[$i+1];
		}
		
		$size = count($consume_data);
		for($i = 0; $i < $size; $i+=2) {
			$names[] = $consume_data[$i];
			$names[] = $consume_data[$i+1];
		}
		
		$size = count($material_data);
		for($i = 0; $i < $size; $i+=2) {
			$names[] = $material_data[$i];
			$names[] = $material_data[$i+1];
		}
		
		$size = count($spell_data);
		for($i = 0; $i < $size; $i+=2) {
			$names[] = $spell_data[$i];
			$names[] = $spell_data[$i+1];
		}
		
		$rtrn = json_encode($names);
		
		return $rtrn;
	
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function item_get() {
		$item_data = array();
		
		$id = $_POST["id"];
		
		$rtrn = "";
		
		if($id != -1) {
		
			$file = "./items/" . $id . ".bin";
			
			$handle = fopen($file, "rb");
			
			if($handle != FALSE) {
				
				$count = 0;
				while(!feof($handle)) {
					
					if($count == 2 || $count == 3) {
						$length = unpack("C", fread($handle, 1));
						$item_data[] = fread($handle, $length[1]);
					} else {
						$length = unpack("C", fread($handle, 1));
						$value = unpack("i", fread($handle, $length[1]));
						if($value != null) {
							$item_data[] = $value[1];
						}
					}
					
					$count++;
				}
				fclose($handle);
				
			}
			
			$rtrn = json_encode($item_data);
		
		} else {
			$rtrn = NULL;
		}
		
		return $rtrn;
		
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function pack_items() {
		
		$zip = new ZipArchive();
		echo("test");
		$ret = $zip->open('./zips/items.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);
		
		
		if ($ret !== TRUE) {
			echo('Failed with code ' . $ret);
		} else {
			$options = array('add_path' => 'items/', 'remove_all_path' => TRUE);
			$zip->addGlob('items/*.{bin,txt}', GLOB_BRACE, $options);
			$zip->close();
		}
		
		return "All packed?";
		
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function save_level() {
		$rtrn = "";
		
		$lv_name = $_POST['lv_name'];
		//$data = json_decode($_POST['data']);
		$data = $_POST['data'];
		$data_write = "";
		
		//$total = count($data);
		
		
		//for($i = 0; $i < $total; $i++) {
		//	$data_write .=  pack("i", $data[$i]);
		//}
		$data_write .= $data;
		$data_write .= pack("i", $_POST['start_x']);
		$data_write .= pack("i", $_POST['start_y']);
		
		file_put_contents("./data/levels/" . $lv_name . ".bin", $data_write);
		
		return "Save successful.";
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function load_level() {
		
		$lv_name = $_POST['lv_name'];
		
		$response['message'] = "";
		$response['data'] = array();
		
		$file = "./data/levels/" . $lv_name .".bin";
		
		$handle = fopen($file, "rb");
		
		if($handle != FALSE) {
			
			$count = 0;
			while(!feof($handle)) {
				$value = @unpack("i", fread($handle, 4));
				if($value != null) {
					$response['data'][] = $value[1];
				}
			}
			$count++;
		}
		fclose($handle);
		
		$response['message'] = "Load successful.";
		
		return json_encode($response);
	}
	//------------------------------------------------------------------------------------------------------------------------------------------
	private function level_list() {
	
		// Scan the entire director for ogg, mp3, wav
		$array = glob('./data/levels/*.{bin}', GLOB_BRACE);
		// Find the amount of files
		$length = count($array);
		// Send message back the list was obtained
		$response["message"] = "List obtained";
		
		// Create the string to hold the HTML as a blank string
		$response["list"] = array();
		
		// For loop to add all the songs, and removing the directory path
		
		$search = array("./data/levels/", ".bin");
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