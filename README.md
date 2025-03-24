# Widget for ChatBot
Chatbot widget to embed on any page

## Developing
Once you've created a project and installed dependencies with npm install (or pnpm install or yarn), start a development server:
```sh
git clone https://github.com/zoltiq/ChatBot.git
cd ChatBot
npm install

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
<link href="/dist/styles.css" rel="stylesheet" />
<script type="module">
	import { createChat } from '/dist/chat.bundle.es.js';

	createChat({
		webhookUrl: 'https://<YOUR-WEBHOOK-URL>',
		title: 'Assistant AI',
		welcomeMessage: 'Hi there! 👋 <br> How can I assist you today?',
        	inputPlaceholder: "Message...",
        	imageUpload: true,
        	emoji: true
	});
</script>
```

## License

GNU General Public License v2.0 
