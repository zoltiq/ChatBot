# ChatBot
Chatbot widget to embed on any page

## Developing
Once you've created a project and installed dependencies with npm install (or pnpm install or yarn), start a development server:
```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building
```sh
npm run build
```

## Usage
Add the following code to your HTML page.
```html
<link href="/dist/style.css" rel="stylesheet" />
<script type="module">
	import { createChat } from '/dist/chat.bundle.es.js';

	createChat({
		webhookUrl: 'https://<YOUR-WEBHOOK-URL>',
		title: 'Assistant AI'
	});
</script>
```

## License

GNU General Public License v2.0 
