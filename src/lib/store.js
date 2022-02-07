function isScriptAlreadyIncluded(url) {
	var scripts = document.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) if (scripts[i].getAttribute('src') == url) return true;
	return false;
}

export const loadJS = (url, cb) => {
	if (isScriptAlreadyIncluded(url)) return cb();
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
	script.onload = () => {
		cb();
	};
};
