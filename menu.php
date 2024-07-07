<?php
$f = file('README.md');
$menu = PHP_EOL;
for ($i = 0; $i < count($f); $i++) {
	if (strpos($f[$i], '| [') !== false) {
		$menu = $f[$i];
		break;
	}
}

$diretorio = dir('./');
while ($arquivo = $diretorio->read()) {
	$ext = strtolower(pathinfo($arquivo, PATHINFO_EXTENSION));
	if ($ext == 'md') {
		$f = file($arquivo);
		for ($i = 0; $i < count($f); $i++) {
			if (strpos($f[$i], '| [') !== false) {
				$f[$i] = $menu;
			}
		}
		$f = implode('', $f);
		file_put_contents($arquivo, $f);
	}
}
$diretorio->close();
