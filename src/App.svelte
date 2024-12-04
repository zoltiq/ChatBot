<script>
  export let webhookUrl, title;

  import { onMount, tick } from "svelte";
 
  let chatInput = "";
  let messages = [];
  let textElement;
  let isChatbotOpen = false;
  let inputInitHeight;
  let sessionId;
  let chatbox;

  onMount(async () => {
    inputInitHeight = textElement.scrollHeight;
    sessionId = crypto.randomUUID();
	});
    
  const sendMessageToAPI = async (userMessage) => {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          chatInput: userMessage,
          sessionId: sessionId
        }),
      });
      const data = await response.json();
      return {msg: data.output, err: false} ;
    } catch (error) {
      return {msg: "Oops! Something went wrong. Please try again.", err: true};
    } finally {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    } 
  };

  const handleChat = async () => {
    if (textElement) {
      textElement.style.height = `${inputInitHeight}px`;
    }

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage) return;
    
    // Add user message
    messages = [...messages, { message: chatInput, className: "outgoing" }];
    chatInput = "";
    await tick();
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    // Add animation while waiting for response
    messages = [...messages, { message: `<div class="dot-typing"></div>`, className: "incoming" }];
    await tick();
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    // Send message to API and update response
    const res = await sendMessageToAPI(trimmedMessage);
    messages[messages.length - 1] = { message: res.msg, className: "incoming", err: res.err };
    await tick();
    chatbox.scrollTo(0, chatbox.scrollHeight);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
    }
  };

  const toggleChatbot = () => {
    isChatbotOpen = !isChatbotOpen;
  };
  
  const inputMessage = () => {
    textElement.style.height = `${textElement.scrollHeight}px`;
  }
</script>




<div class:chatbot__show={isChatbotOpen}>
  <button on:click={toggleChatbot} class="chatbot__toggler">
    <span class="material-symbols-outlined">mode_comment</span>
    <span class="material-symbols-outlined">close</span>
  </button>

  <div class="chatbot">
    <header>
      <h2>{title}</h2>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span on:click={toggleChatbot} class="material-symbols-outlined">close</span>
    </header>
    <ul bind:this={chatbox} class="chatbox">
      <li class="incoming">
        <span class="material-symbols-outlined">smart_toy</span>
        <p>Hi 👋 <br> How can I help you today?</p>
      </li>

      {#each messages as { message, className, err }}
        <li class={className}>
          {#if className === "outgoing"}
            <p>{message}</p>
          {:else}
            <span class="material-symbols-outlined">smart_toy</span>
            <p class:error={err}>{@html message}</p>
          {/if}
        </li>
      {/each}

    </ul>
    <div class="chat__input">
      <textarea bind:this={textElement} bind:value={chatInput} on:keydown={handleKeyDown} on:input={inputMessage} placeholder="Enter your question..." required></textarea>
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <span on:click={handleChat} class="material-symbols-outlined">send</span>
    </div>
  </div>
</div>