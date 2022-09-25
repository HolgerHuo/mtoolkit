# react-umami

this package is a class to easy integrate [umami](https://umami.is/) in your react projects.

## quickStart

install the package : 

```bash
npm i react-umami
```

create a react_umami class instance 

```javascript
const tracker = new react_umami(
		websiteId,
		hostname,
		umamiUrl
	);
```
then import it where you want to track view :

```javascript
tracker.trackView("/");
```

or track event :

```javascript
	tracker.trackEvent(eventType, eventValue, url);
```

## Author :

Lucas Sovre [portfolio](https://lucassovre.github.io/)
