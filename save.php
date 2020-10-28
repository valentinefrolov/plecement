<?php

if (array_key_exists('data', $_POST)) {


    $imgData = base64_decode($_POST['data']);
    $name = (!empty($_POST['name']) ? $_POST['name'] : 'image') . '.png';
    $filePath = $_SERVER['DOCUMENT_ROOT'] . '/saved/'.$name;

    $file = fopen($filePath, 'w+');
    fwrite($file, $imgData);
    fclose($file);

    echo 'http://graphicex.aplex.ru/saved/'. $name;
} else {
    echo 'fuck';
}

