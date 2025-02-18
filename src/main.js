import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

export function createChat({ webhookUrl, title, welcomeMessage, inputPlaceholder, imageUpload, emoji }) {
  let container = document.querySelector('.chatbot-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'chatbot-container';
    document.body.appendChild(container);
  }
  
  mount(App, {
    target: document.querySelector('.chatbot-container'),
    props: {
      webhookUrl,
      title,
      welcomeMessage,
      inputPlaceholder,
      imageUpload,
      emoji
    },
  })

}