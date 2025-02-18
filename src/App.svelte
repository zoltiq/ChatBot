<script>
	export let webhookUrl, title, welcomeMessage, inputPlaceholder, imageUpload, emoji;

	import { onMount, tick } from "svelte";
	import data from '@emoji-mart/data'
	import { Picker } from 'emoji-mart'

	let chatBot;
	let isChatbotOpen = false;
	let sessionId;
	let messageInput;
	let initialInputHeight;
	let fileUploaded = false;
	let chatBody;
	let fileInput;
	let messages = [];
	let imageSrc = "#";
	let chatForm;
	let picker;


	let userData = {
   	message: null,
   	file: {
      	data: null,
      	mime_type: null
   	}
	}

	onMount(() => {

		initialInputHeight = messageInput.scrollHeight;
   	sessionId = crypto.randomUUID();
		
		picker = new Picker({
      	theme: "light",
      	skinTonePosition: "none",
      	previewPosition: "none",
      	onEmojiSelect: (emoji) => {

      		const { selectionStart: start, selectionEnd: end } = messageInput;

      		messageInput.setRangeText(emoji.native, start, end, "end");
      		messageInput.focus();
      	},
      	onClickOutside: (e) => {
      		if(e.target.id === "emoji-picker") {
         		document.body.classList.toggle("show-emoji-picker");
      		} else {
         		document.body.classList.remove("show-emoji-picker");
      		}
      	}
   	});

   	chatForm.appendChild(picker);

   	return () => {
      	if (picker && picker.parentNode) {
      		picker.parentNode.removeChild(picker);
      	}
   	};

		
	});


	const generateBotResponse = async () => {
		// API request options
   	const requestOptions = {
      	method: "POST",
      	headers: {"Content-Type": "application/json"},

			body: JSON.stringify({
         	action: "sendMessage",
         	chatInput: userData.message,
         	sessionId: sessionId
      	}),

   	}

		try {
      	// Fetch bot response from API
      	const response = await fetch(webhookUrl, requestOptions);
      	const data = await response.json();
      	if(!response.ok) throw new Error(data.error.message);

      	// Extract and display bot's response text
			const apiResponseText = data.output.replace(/\*\*(.*?)\*\*/g, "$1").trim();
			messages[messages.length - 1] = { content: {message: apiResponseText}, className: "bot-message" };
   	} catch (error) {
			console.log(error);
			messages[messages.length - 1] = { content: {message: error.message}, className: "bot-message", err: true };
   	} finally {
	  		await tick();
	  		chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
   	}
	
	}

	const handleOutgoingMessage = async (e) => {
		e.preventDefault();
		userData.message = messageInput.value.trim();
		messageInput.value = "";

		fileUploaded = false;
		messageInput.dispatchEvent(new Event("input"));

		// Add user message
		messages = [...messages, { content: { ...userData }, className: "user-message" }];
		await tick();
		chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

		// Add animation while waiting for response
		let dotAnimation = `<div class="thinking-indicator">
                  			<div class="dot"></div>
                  			<div class="dot"></div>
                  			<div class="dot"></div>
               			</div>`
		messages = [...messages, { content: {message: dotAnimation}, className: "bot-message" }];
   	await tick();
		chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
		
		generateBotResponse();
	}
	
	const handleKeyDown = (e) => {
		const userMessage = e.target.value.trim();
   	if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
			handleOutgoingMessage(e);
   	}
	};

	function handleFileChange(e) {
   	const file = e.target.files[0];
   	if (!file) return;

   	const reader = new FileReader();
   	reader.onload = (e) => {
      	imageSrc = e.target.result.toString();
        	const base64String = imageSrc.split(",")[1];

      	userData.file = {
        		data: base64String,
        		mime_type: file.type
      	};

			fileUploaded = true;
      	fileInput.value = "";
    	};
    	reader.readAsDataURL(file);
	}

	function handleInput() {
		messageInput.style.height = `${initialInputHeight}px`;
   	messageInput.style.height = `${messageInput.scrollHeight}px`;
   	chatForm.style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
	}

	function handleCancel() {
   	userData.file = {data: null, mime_type: null};
   	fileUploaded = false;
	}
	
	const toggleChatbot = () => {
   	isChatbotOpen = !isChatbotOpen;
	};
</script>


<div bind:this={chatBot} class:show-chatbot={isChatbotOpen}>

	<button id="chatbot-toggler" on:click={toggleChatbot} >
		<span class="material-symbols-rounded">mode_comment</span>
		<span class="material-symbols-rounded">close</span>
	</button>

	<div class="chatbot-popup">
		<!-- Chatbot Header -->
		<div class="chat-header">
   		<div class="header-info">
      		<svg class="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
         		<path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
      		</svg>
      		<h2 class="logo-text">{title}</h2>
   		</div>
   		<button id="close-chatbot" on:click={toggleChatbot} class="material-symbols-rounded">keyboard_arrow_down</button>
		</div>

		<!-- Chatbot Body-->
		<div bind:this={chatBody} class="chat-body">
   		<div class="message bot-message">
      		<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
         		<path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
      		</svg>
      		<div class="message-text">{@html welcomeMessage}
      		</div>
   		</div>

			{#each messages as { content, className, err }}
				<div class="message {className}">
          		{#if className === "user-message"}
            		<div class="message-text">{content.message}</div>
						{#if content.file.data}
							<!-- svelte-ignore a11y_missing_attribute -->
							<img src="data:{content.file.mime_type};base64,{content.file.data}" class="attachment" />
						{/if}
					{:else}
						<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
							<path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
						</svg>
            		<div class:error={err} class="message-text" >{@html content.message}</div>
          		
					{/if}
				</div>
      	{/each}
		</div>

		<!-- Chatbot Footer-->
		<div class="chat-footer">
   		<form action="#" class="chat-form" bind:this={chatForm}>
      		<textarea bind:this={messageInput} on:keydown={handleKeyDown} on:input={handleInput} placeholder={inputPlaceholder} class="message-input" required></textarea>
      		<div class="chat-controls">
         		{#if emoji}
						<button type="button" id="emoji-picker" class="material-symbols-outlined">sentiment_satisfied</button>
					{/if}
         		{#if imageUpload}
						<div class="file-upload-wrapper" class:file-uploaded={fileUploaded}>
            			<input type="file" accept="image/*" id="file-input" bind:this={fileInput} on:change={handleFileChange} hidden>
            			<!-- svelte-ignore a11y_missing_attribute -->
            			<img src={imageSrc}>
            			<button type="button" id="file-upload" on:click={() => fileInput.click()} class="material-symbols-rounded">attach_file</button>
            			<button type="button" id="file-cancel" on:click={handleCancel} class="material-symbols-rounded">close</button>
         			</div>
					{/if}
         		<button on:click={handleOutgoingMessage} type="submit" id="send-message" class="material-symbols-rounded">arrow_upward</button>
      		</div>
   		</form>
		</div>
	</div>

</div>