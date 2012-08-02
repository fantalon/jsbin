/**
 * list.js - 사용자별, 작성된 'bin' 목록 단추 액션 처리
 * @author: A.J <andrwj@gmail.com>
 * @date: 2012-04-04 (수)
 * 
 * @date: 2012-08-02 (수)
 * - it dosen't work
 */
(function() {

var authorizing = function(){
	jsbin.on();
	jsbin.home('andrwj', '');
};

var $list = $('a#btnSavedList');
/*
$list.click(function (event) {
	event.preventDefault();

	if( jsbin.active && jsbin.settings.home ) {
		if( !$list.hasClass('authorized') ) {
			authorizing();
		} else {
        	$list.text( jsbin.settings.home + "'s list" ).addClass('authorized');
		}
	} else {
        	$list.text( "login" ).removeClass('authorized');
	}
	return false;
  });
*/

if( (jsbin.active && jsbin.settings.home) ) {
  authorizing();
  $list.append( jsbin.settings.home ).addClass('authorized');
} else {
  $list.text( 'login' ).removeClass('authorized');
}

/*TODO: re-create following code ... */

$("#start-new-bin").click(function(){
	$("#newbinmodal").modal({keyboard:true});
	setTimeout(function(){
		$("#new-project-name").focus();
	},500);	
	return false;
});
$("#cancel-new-bin").click(function(){
	$("#newbinmodal").modal('hide');
	return false;
});
$("#create-new-bin").click(function(){
	$("#form-new-bin").trigger('submit');
	return false;
});

$("#form-new-bin").submit(function(){
	var $input = $("#new-project-name");
	var url = $input.val();
	url = url.trim();
	url = url.replace(' ','-');
	if(url == '-' || !url) {
		$input.focus();	
		return false;
	} 
	$("#newbinmodal").modal('hide');
	window.location.assign("/" + url); 
	return false;
});

})();
