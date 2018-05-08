<?php

	$width = 100;
	$height = 100;

	echo("<table border=0 cellpadding=0 cellspacing=1 bgcolor=#000000>");
	for($a = ($height-1); $a >= 0; $a--) {
		echo("<tr>");
		for($b = 0; $b < $width; $b++) {
			echo("<td id=\"map-$b-$a\" bgcolor=#FFFFFF width=20 height=20 title=\"$b-$a\" href=\"./\"></td>");
		}
		echo("</tr>");
	}
	echo("</table>");

?>
