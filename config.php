<?php

header('Access-Control-Allow-Origin: *');

$url = 'http://graphicex.aplex.ru/';

$outlet = getimagesize('img/outlet.png');
$trash = getimagesize('img/trash.png');
$hanger = getimagesize('img/hanger.png');
$spot = getimagesize('img/spot.png');
$archive = getimagesize('img/archive.png');
$archive1 = getimagesize('img/archive1.png');
$table = getimagesize('img/table.png');
$table1 = getimagesize('img/table1.png');
$table2 = getimagesize('img/table2.png');
$showcase = getimagesize('img/showcase.png');
$showcase1 = getimagesize('img/showcase1.png');
$showcase2 = getimagesize('img/showcase2.png');


$json = array(
    'dict' => array(
        'delete' => 'Удалить',
        'copy' => 'Копировать',
        'rotate' => 'Повернуть',
        'flip_vertical' => 'Отразить по вертикали',
        'flip_horizontal' => 'Отразить по горизонтали'
    ),
    'layout' => array(
        'cols' => 14,
        'rows' => 7,
        'size' => 45,
        'padding' => '40px'
    ),
    "elements" => array(
        array(
            "title" => "Элемент стен",
            "type" => "wall",
            "width" => 60,
            "height" => 10
        ),
        array(
            "title" => "Дверь",
            "type" => "door",
            "width" => 60,
            "height" => 30,
            "group" => "Двери"
        ),
        array(
            "title" => "Дверь-шторка",
            "type" => "curtain",
            "width" => 60,
            "height" => 10,
            "group" => "Двери"
        ),
        array(
            "title" => "Фризовая панель с надписью",
            "type" => "panel",
            "width" => 193,
            "height" => 25,
            "text_only" => true
        ),
        array(
            "title" => "Электрическая розетка",
            "type" => "image",
            "src" => "{$url}img/outlet.png",
            "width" => $outlet[0],
            "height" => $outlet[1],
            "group" => "Базовые элементы"
        ),
        array(
            "title" => "Корзина для мусора",
            "type" => "image",
            "src" => "{$url}/img/trash.png",
            "width" => $trash[0],
            "height" => $trash[1],
            "group" => "Базовые элементы"
        ),
        array(
            "title" => "Вешалка",
            "type" => "image",
            "src" => "{$url}/img/hanger.png",
            "width" => $hanger[0],
            "height" => $hanger[1],
            "group" => "Базовые элементы"
        ),
        array(
            "title" => "Спот-бра",
            "type" => "image",
            "src" => "{$url}/img/spot.png",
            "width" => $spot[0],
            "height" => $spot[1],
            "group" => "Базовые элементы"
        ),
        array(
            "title" => "321",
            "type" => "image",
            "src" => "{$url}/img/archive.png",
            "width" => $archive[0],
            "height" => $archive[1],
            "group" => "Архивные шкафы"
        ),
        array(
            "title" => "320",
            "type" => "image",
            "src" => "{$url}/img/archive1.png",
            "width" => $archive1[0],
            "height" => $archive1[1],
            "group" => "Архивные шкафы"
        ),
        array(
            "type" => "image",
            "src" => "{$url}/img/table.png",
            "width" => $table[0],
            "height" => $table[1],
            "group" => "Стол со стульями",
            "inline" => true
        ),
        array(
            "type" => "image",
            "src" => "{$url}/img/table1.png",
            "width" => $table1[0],
            "height" => $table1[1],
            "group" => "Стол со стульями",
            "inline" => true
        ),
        array(
            "type" => "image",
            "src" => "{$url}/img/table2.png",
            "width" => $table2[0],
            "height" => $table2[1],
            "group" => "Стол со стульями",
            "inline" => true
        ),
        array(
            "title" => "398 (H-2.5m с подсветкой) ",
            "type" => "image",
            "src" => "{$url}/img/showcase.png",
            "width" => $showcase[0],
            "height" => $showcase[1],
            "group" => "Витрины"
        ),
        array(
            "title" => "396 (H-1.8m) ",
            "type" => "image",
            "src" => "{$url}/img/showcase1.png",
            "width" => $showcase1[0],
            "height" => $showcase1[1],
            "group" => "Витрины"
        ),
        array(
            "title" => "394 (H-1.1m) ",
            "type" => "image",
            "src" => "{$url}/img/showcase2.png",
            "width" => $showcase2[0],
            "height" => $showcase2[1],
            "group" => "Витрины"
        )
    )
);

echo json_encode($json);
