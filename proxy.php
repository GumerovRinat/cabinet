<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: X-Requested-With");
header("Content-Type: application/json");

function handleError($curl, $code) {
  header("HTTP/1.1 400 Bad Request");
  echo json_encode($code . " Во время запроса произошла ошибка. Пожалуйста повторите попытку позже.");
  curl_close($curl);
  die;
}

function getQuery($q = null) {
  $curl = curl_init();
  curl_setopt($curl,CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_TIMEOUT, 10);
  curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
  curl_setopt($curl, CURLOPT_URL, "http://185.126.183.116:3306/api/" . $q);
  $a = curl_exec($curl);
  if (!curl_errno($curl)) {
    switch ($http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE)) {
      case 200:
        break;
      case 201:
        break;
      default:
        handleError($curl, $http_code);
    }
  }
  curl_close($curl);
  if (!empty($a)) {
    echo $a;
  }
  die;
}

function postQuery($q) {
  $payload = json_encode($q);
  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, "http://185.126.183.116:3306/api/Visit");
  curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
  curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type:application/json"));
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_POST, true);
  $a = curl_exec($curl);
  if (!curl_errno($curl)) {
    switch ($http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE)) {
      case 200:
        break;
      case 201:
        break;
      default:
        handleError($curl, $http_code);
    }
  }
  curl_close($curl);
  if (!empty($a)) {
    echo $a;
  }
  die;
}

if (isset($_GET['direction']) && $_GET['direction'] == "mrt" ) 
{
  $_GET['a'] = "Doctor";
  $_GET['b'] = "Doctor/specialisation/21";
}

if($_GET["a"] === "Specialisation") {
  getQuery($_GET["a"]);
}

if($_GET["a"] === "Spec") {
  getQuery($_GET["b"]);
}

if($_GET["a"] === "Doctor" || $_GET["a"] === "Schedule") {
  getQuery($_GET["b"]);
}

if($_GET["a"] === "Visit") {
  $params = [
    "birthDate" => $_GET["birthDate"],
    "family" => $_GET["family"],
    "name" => $_GET["name"],
    "ot" => $_GET["ot"],
    "phone" => $_GET["phone"],
    "recordId" => (int)$_GET["recordId"],
    "visitId" => (int)$_GET["visitId"]
  ];
  postQuery($params);
}
?>
