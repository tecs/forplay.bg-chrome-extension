const script = document.createElement('script')
script.src = '//ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js';
script.onload = () => script.parentNode.removeChild(script);

const container = document.head || document.documentElement;
container.insertBefore(script, container.children[0])
