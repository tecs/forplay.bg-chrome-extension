function replaceText(text, oTextHandle)
{
    var begin = oTextHandle.value.substr(0, oTextHandle.selectionStart);
    var end = oTextHandle.value.substr(oTextHandle.selectionEnd);
    var scrollPos = oTextHandle.scrollTop;
    oTextHandle.value = begin + text + end;
    if (oTextHandle.setSelectionRange) {
        oTextHandle.focus();
        oTextHandle.setSelectionRange(begin.length + text.length, begin.length + text.length);
    }
    oTextHandle.scrollTop = scrollPos;
}

function rand(arr)
{
    return arr[Math.round( Math.random() * (arr.length - 1) )];
}

(function ($) {
    // Cached variables
    var youtubeRegex = /https?:\/\/(www\.|m.)?(youtube\.com|youtu\.be)\/(embed\/|v\/|watch\?(.*&)?v=)([\w-]+)/;

    //Run on jQuery ready
    $(document).ready(function () {
        // First of all, let's make that logo useful
        $('#logo a').attr('href', 'http://forplay.bg/forums/index.php');

        // As for links...
        $('.post .inner a').each(function() {
            // Open in new window
            $(this).attr('target', '_blank');

            // Embed youtube links
            if (youtubeRegex.test(this.href)) {
                var url = 'http://www.youtube.com/embed/' + youtubeRegex.exec(this.href).pop() + '?rel=0';
                $(this).after(
                    $('<br>'),
                    $('<iframe title="YouTube video player" width="640" height="385" frameborder="0" allowfullscreen="">').attr('src', url)
                );
            }
        });

        // Let's add comment "generation" from vbox7.com
        $('.button_submit').parent().prepend($('<input type="submit" value="VBOX7" onclick="return false;" class="button_submit vbox7">').click(function() {
            var $self = $(this).attr('disabled', true);
            $.get('http://vbox7.com/ajax/home/popular.php', function(data) {
                var mdkey = rand(data.items).mdkey;
                $.get('http://vbox7.com/ajax/nginx/aj_comment_get_json_v1.php', {mdkey: mdkey}, function(data) {
                    var pagination = data.pop();
                    if (!data.length) {
                        $('.button_submit.vbox7').click();
                        return;
                    }
                    var comment = rand(data).d.comment;
                    replaceText(comment, $('textarea[name=message]')[0]);
                    $self.attr('disabled', false);
                }, 'json');
            });
        }));

        // Let's add comment "generation" from pcmania.bg
        $('.button_submit').parent().prepend($('<input type="submit" value="PC Mania" onclick="return false;" class="button_submit pcmania">').click(function() {
            var $self = $(this).attr('disabled', true);
            $.get('http://pcmania.bg/?go=news&p=list', function(data) {
                var url = rand($(data).find('table.mainTable').eq(1).find('a')).getAttribute('href');
                $.get('http://pcmania.bg' + url, function(data) {
                    var comments = $(data).find('.commentTableRe td.content[valign=top], .commentTable td.content[valign=top]');
                    if (!comments.length) {
                        $('.button_submit.pcmania').click();
                        return;
                    }
                    var comment = rand(comments);
                    $(comment).find('span').remove();
                    comment = $(comment).text().split('ч. :')[1].trim();
                    replaceText(comment, $('textarea[name=message]')[0]);
                    $self.attr('disabled', false);
                });
            });
        }));
    });
})(jQuery);
