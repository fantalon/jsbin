// to allow for download button to be introduced via beta feature
$('a.save').click(function (event) {
  event.preventDefault();

  analytics.milestone();
  // if save is disabled, hitting save will trigger a reload
  saveCode('save', jsbin.saveDisabled === true ? false : true);

  return false;
});

$document.on('saved', function updateSavedState() {
  $('#share form div').each(function () {
    var $div = $(this).removeClass('disabled').unbind('click mousedown mouseup'),
        url = jsbin.getURL() + this.getAttribute('data-path');
    $div.find('a').attr('href', url);
    $div.find('input').val(url);
    $div.find('textarea').val(function () {
      return ('<a href="' + url + '?live">' + documentTitle + '</a><' + 'script src="' + jsbin.static + '/js/embed.js"><' + '/script>').replace(/<>"&/g, function (m) {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '&': '&amp;'
        }[m];
      });
    });
  }).closest('.menu').removeClass('hidden');

  $('#jsbinurl').attr('href', jsbin.getURL()).removeClass('hidden');
  $('#clone').removeClass('hidden');
});

// updateSavedState();

var saveChecksum = jsbin.state.checksum || sessionStorage.getItem('checksum') || false;

if (saveChecksum) {
  // remove the disabled class, but also remove the cancelling event handlers
  $('#share div.disabled').removeClass('disabled').unbind('click mousedown mouseup');
} else {
  $('#share div.disabled').one('click', function (event) {
    event.preventDefault();
    $('a.save').click();
  });
}

// TODO decide whether to expose this code, it disables live saving for IE users
// until they refresh - via a great big yellow button. For now this is hidden
// in favour of the nasty hash hack.
if (false) { // !saveChecksum && !history.pushState) {
  jsbin.saveDisabled = true;

  $document.bind('jsbinReady', function () {
    $document.one('codeChange', function () {
      $('#start-saving').css('display', 'inline-block');
    });
  });
}

// only start live saving it they're allowed to (whereas save is disabled if they're following)
if (!jsbin.saveDisabled) {
  $document.bind('jsbinReady', function () {
    $('.code.panel .label .name').append('<span>Saved</span>');

    var savingLabels = {
      html: $('.panel.html .name span'),
      javascript: $('.panel.javascript .name span'),
      css: $('.panel.css .name span')
    };

    jsbin.panels.allEditors(function (panel) {
      panel.on('processor', function () {
        // if the url doesn't match the root - i.e. they've actually saved something then save on processor change
        if (jsbin.root !== jsbin.getURL()) {
          $document.trigger('codeChange', [{ panelId: panel.id }]);
        }
      });
    });

    $document.bind('codeChange', function (event, data) {
      // savingLabels[data.panelId].text('Saving');
      if (savingLabels[data.panelId]) {
        savingLabels[data.panelId].css({ 'opacity': 0 }).stop(true, true);
      }
    });

    $document.bind('saveComplete', throttle(function (event, data) {
      // show saved, then revert out animation
      savingLabels[data.panelId].stop(true, true).animate({ 'opacity': 1 }, 100).delay(1200).animate({
        'opacity': '0'
      }, 500);
    }, 500));

    // TODO use sockets for streaming...or not?
    // var stream = false;

    // if (jsbin.state.stream && window.WebSocket) {
    //   stream = new WebSocket('ws://' + window.location.origin + '/update');
    // }

    $document.bind('codeChange', throttle(function (event, data) {
      if (!data.panelId) return;

      var panelId = data.panelId,
          panelSettings = {};

      if (jsbin.state.processors) {
        panelSettings.processors = jsbin.state.processors;
      }

      if (!saveChecksum) {
        // create the bin and when the response comes back update the url
        saveCode('save', true);
      } else {
        $.ajax({
          url: jsbin.getURL() + '/save',
          data: { 
            code: jsbin.state.code, 
            revision: jsbin.state.revision,
            method: 'update',
            panel: data.panelId,
            content: editors[data.panelId].getCode(),
            checksum: saveChecksum,
            settings: JSON.stringify(panelSettings)
          },
          type: 'post',
          dataType: 'json',
          headers: {'Accept': 'application/json'},
          success: function (data) {
            $document.trigger('saveComplete', { panelId: panelId });
            if (data.error) {
              saveCode('save', true, function (data) {
                // savedAlready = data.checksum;
              });
            }
          },
          error: function () {
            console && console.log('update error');
          }
        });
      }
    }, 250));
  });
}

$('a.clone').click(function (event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  analytics.clone();

  var $form = setupform('save,new');
  $form.submit();

  return false;
});

function setupform(method) {
var $form = $('form#saveform').empty()
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />')
    .append('<input type="hidden" name="css" />')
    .append('<input type="hidden" name="method" />')
    .append('<input type="hidden" name="_csrf" value="' + jsbin.state.token + '" />')
    .append('<input type="hidden" name="settings" />');

  var settings = {};

  if (jsbin.state.processors) {
    settings.processors = jsbin.state.processors;
  }

  $form.find('input[name=settings]').val(JSON.stringify(settings));
  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=css]').val(editors.css.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  $form.find('input[name=method]').val(method);

  return $form;
}

function pad(n){
  return n<10 ? '0'+n : n
}

function ISODateString(d){
  return d.getFullYear()+'-'
    + pad(d.getMonth()+1)+'-'
    + pad(d.getDate())+'T'
    + pad(d.getHours())+':'
    + pad(d.getMinutes())+':'
    + pad(d.getSeconds())+'Z'
}

function saveCode(method, ajax, ajaxCallback) {
  // create form and post to it
  var $form = setupform(method);
  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  jsbin.panels.saveOnExit = true;

  if (ajax) {
    $.ajax({
      url: $form.attr('action'),
      data: $form.serialize(),
      dataType: 'json', 
      type: 'post',
      headers: {'Accept': 'application/json'},
      success: function (data) {
        var $binGroup,
            edit;

        $form.attr('action', data.url + '/save');
        ajaxCallback && ajaxCallback(data);

        sessionStorage.setItem('checksum', data.checksum);
        saveChecksum = data.checksum;

        jsbin.state.code = data.code;
        jsbin.state.revision = data.revision;

        $binGroup = $('#history tr[data-url="' + jsbin.getURL() + '"]');
        edit = data.edit.replace(location.protocol + '//' + window.location.host, '') + window.location.search;
        $binGroup.find('td.url a span.first').removeClass('first');
        $binGroup.before('<tr data-url="' + data.url + '/" data-edit-url="' + edit + '"><td class="url"><a href="' + edit + '?live"><span class="first">' + data.code + '/</span>' + data.revision + '/</a></td><td class="created"><a href="' + edit + '" pubdate="' + data.created + '">Just now</a></td><td class="title"><a href="' + edit + '">' + data.title + '</a></td></tr>');

        $document.trigger('saved');

        if (window.history && window.history.pushState) {
          window.history.pushState(null, edit, edit);
          sessionStorage.setItem('url', jsbin.getURL());
        } else {
          window.location.hash = data.edit;
        }
      },
      error: function () {

      }
    });
  } else {
    $form.submit();
  }
}
