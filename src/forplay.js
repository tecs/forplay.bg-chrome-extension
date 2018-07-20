const replaceText = (text, oTextHandle) => {
    const begin = oTextHandle.value.substr(0, oTextHandle.selectionStart);
    const end = oTextHandle.value.substr(oTextHandle.selectionEnd);
    const scrollPos = oTextHandle.scrollTop;

    oTextHandle.value = begin + text + end;

    if (oTextHandle.setSelectionRange) {
        oTextHandle.focus();
        oTextHandle.setSelectionRange(begin.length + text.length, begin.length + text.length);
    }

    oTextHandle.scrollTop = scrollPos;
}

const rand = arr => arr[Math.round( Math.random() * (arr.length - 1) )];

($ => {
    // Cached variables
    const youtubeRegex = /https?:\/\/(www\.|m.)?(youtube\.com|youtu\.be)\/(embed\/|v\/|watch\?(.*&)?v=)([\w-]+)/;

    //Run on jQuery ready
    $(document).ready(() => {
        // First of all, let's make that logo useful
        $('#logo a').attr('href', '//www.forplay.bg/forums/index.php');

        // As for links...
        $('.post .inner a').each(function () {
            // Open in new window
            $(this).attr('target', '_blank');

            // Embed youtube links
            if (youtubeRegex.test(this.href)) {
                const url = '//www.youtube.com/embed/' + youtubeRegex.exec(this.href).pop() + '?rel=0';
                $(this).after(
                    $('<br>'),
                    $('<iframe title="YouTube video player" width="640" height="385" frameborder="0" allowfullscreen="">').attr('src', url)
                );
            }
        });

        // Let's add comment "generation" from vbox7.com
        $('.button_submit').parent().prepend(
            $('<input type="submit" value="VBOX7" onclick="return false;" class="button_submit vbox7">').click(function () {
                const $self = $(this).attr('disabled', true);
                $.get('//vbox7.com/ajax/home/popular.php', data => {
                    const { mdkey } = rand(data.items);
                    $.get('//vbox7.com/ajax/comment/fetch.php', { mdkey }, data => {
                        if (!data.items.length) {
                            return $('.button_submit.vbox7').click();
                        }
                        const { body } = rand(data.items);
                        replaceText(body, $('textarea[name=message]')[0]);
                        $self.attr('disabled', false);
                    }, 'json');
                });
            })
        );

        // Let's add comment "generation" from pcmania.bg
        $('.button_submit').parent().prepend(
            $('<input type="submit" value="PC Mania" onclick="return false;" class="button_submit pcmania">').click(function () {
                const $self = $(this).attr('disabled', true);
                $.get('//pcmania.bg/?go=news&p=list', data => {
                    const url = rand($(data).find('table.mainTable').eq(1).find('a')).getAttribute('href');
                    $.get(`//pcmania.bg${url}`, data => {
                        const comments = $(data).find('.commentTableRe td.content[valign=top], .commentTable td.content[valign=top]');
                        if (!comments.length) {
                            return $('.button_submit.pcmania').click();
                        }
                        let comment = rand(comments);
                        $(comment).find('span').remove();
                        comment = $(comment).text().split('ч. :')[1].trim();
                        replaceText(comment, $('textarea[name=message]')[0]);
                        $self.attr('disabled', false);
                    });
                });
            })
        );
    });
})(jQuery);
