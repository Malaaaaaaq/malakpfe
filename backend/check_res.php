<?php
$content = file_get_contents('c:\Users\dell\Desktop\MyPfe\pfemalak\src\components\ClientDashboard.jsx');
$lines = explode("\n", $content);
foreach ($lines as $i => $line) {
    if (strpos($line, 'upcoming') !== false || strpos($line, 'status ===') !== false || strpos($line, 'Prochaine') !== false) {
        echo "Line " . ($i + 1) . ": " . trim($line) . "\n";
    }
}
