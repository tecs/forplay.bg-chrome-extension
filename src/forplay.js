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
    });


})(jQuery);