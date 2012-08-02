<?php if ( ! defined('ROOT')) exit('No direct script access allowed');

date_default_timezone_set("Asia/Seoul");

function plural($num) {
	if ($num != 1)
		return "s";
}

function getRelativeTime($date) {
  $time = @strtotime($date);
	$diff = time() - $time;
	if ($diff<60)
		return $diff . " second" . plural($diff) . " ago";
	$diff = round($diff/60);
	if ($diff<60)
		return $diff . " minute" . plural($diff) . " ago";
	$diff = round($diff/60);
	if ($diff<24)
		return $diff . " hour" . plural($diff) . " ago";
	$diff = round($diff/24);
	if ($diff<7)
		return $diff . " day" . plural($diff) . " ago";
	$diff = round($diff/7);
	if ($diff<4)
		return $diff . " week" . plural($diff) . " ago";
  if (date('Y', $time) != date('Y', time())) 
    return date("j-M Y", $time);
	return date("j-M", $time);
}
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset=utf-8 />
<style>
#savedbins {
  width: 70%;
  font-size: 12px;
  padding: 10px 0;
  position: relative;
}

#savedbins > span {
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, Arial;
  font-weight: bold;
  margin-bottom: 10px;
}

table#savedlistTable {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  position: relative;
}

table#savedlistTable td {
  margin: 0;
  padding: 3px 0;
}

table#savedlistTable a {
  text-decoration: none;
  color: #000;
  font-weight: normal;
}

table#savedlistTable .url {
  text-align: right;
  padding-left: 0px;
  padding-right: 10px;
}

table#savedlistTable .url a {
  color: #0097fe;
}

table#savedlistTable .url a span {
  visibility: hidden;
}

table#savedlistTable .url span.first {
  visibility: visible;
}

table#savedlistTable td.created {
	width: 90px;
}

table#savedlistTable td.created a {
  color: grey;
}

table#savedlistTable tr:hover *,
table#savedlistTable tr.hover *,
table#savedlistTable tr:hover span,
table#savedlistTable tr.hover span {
  background: #dfdfdf;
  color: #0097fe;
  cursor: pointer;
  border-radius: 3px;
  font-weight: bold;
}

table#savedlistTable tr[data-type=spacer]:hover * {
  background: #fff;
  cursor: default;
}
</style>
</head>
<body style="padding:0; margin:0;">
<div id="savedbins" style="width:100%; margin-top:12px;padding:0;">
<span>Saved List</span>
<table style="width:100%;" id="savedlistTable">
<tbody>
<?php 
$last = null;
arsort($order);
foreach ($order as $key => $value) {
  $cnt = 0;
  foreach ($bins[$key] as $bin) {
    $url = formatURL($bin['url'], $bin['revision']);
    preg_match('/<title>(.*?)<\/title>/', $bin['html'], $match);
    preg_match('/<body.*?>(.*)/s', $bin['html'], $body);
    $title = '';
    if (count($body)) {
      $title = $body[1];
      if (get_magic_quotes_gpc() && $body[1]) {
        $title = stripslashes($body[1]);
      }
      $title = trim(preg_replace('/\s+/', ' ', strip_tags($title)));
    }
    if (!$title && $bin['javascript']) {
      $title = preg_replace('/\s+/', ' ', $bin['javascript']);
    }

    if (!$title && count($match)) {
      $title = get_magic_quotes_gpc() ? stripslashes($match[1]) : $match[1];
    }

    $firstTime = $bin['url'] != $last;

    if ($firstTime && $last !== null) : ?>
  <tr data-type="spacer"><td colspan=2></td></tr>
<?php endif ?>
  <?php if ($cnt <1) { ?>
  <tr data-url="<?=$url?>" class="binrow">
    <td class="url"><a href="<?=$url?>edit"><span<?=($firstTime ? ' class="first"' : '') . '>' . $bin['url']?></span></a> <span class="badge badge-info"><?=$bin['revision']?></span></td>
    <td class="created"><a pubdate="<?=$bin['created']?>" href="<?=$url?>edit"><?=getRelativeTime($bin['created'])?></a></td>
  </tr>
  <?php } else { break; } ?>
<?php
    $cnt++;
    $last = $bin['url'];
  } 
} ?>
</tbody>
</table>
</div>
</body>
</html>
