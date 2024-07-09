<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        {{ message.content }}
        <div v-if="message.products" class="product-results">
          <h3>Product Results:</h3>
          <ul>
            <li v-for="product in message.products" :key="product.id">
              {{ product.name }} - ${{ product.price }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="input-container">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const messages = ref([])
const userInput = ref('')
const messagesContainer = ref(null)

const ANTHROPIC_API_KEY = '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' // Replace with your actual API key

const systemInstructions = `
You are an AI assistant with the ability to search for products. When a user asks about finding or buying a product, you should use the following format to initiate a product search:

[SEARCH_PRODUCTS: search query]

For example, if a user asks about running shoes, you might respond with:
"Certainly! I can help you find running shoes. Let me search for some options.
[SEARCH_PRODUCTS: running shoes]"

After you use this search command, I will provide you with the search results, which you can then discuss with the user.
`

const searchProducts = async (query) => {
  try {
    // Replace this URL with your actual backend API endpoint
    const response = await fetch(`/api/search-products?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    return data.products
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const userMessage = { role: 'user', content: userInput.value }
  messages.value.push(userMessage)
  userInput.value = ''

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [
          { role: 'system', content: systemInstructions },
          ...messages.value
        ],
        max_tokens: 1000,
      }),
    })

    const data = await response.json()
    let assistantMessage = { role: 'assistant', content: data.content[0].text }

    // Check if the assistant's response includes a product search request
    const searchMatch = assistantMessage.content.match(/\[SEARCH_PRODUCTS: (.+?)\]/i)
    if (searchMatch) {
      const searchQuery = searchMatch[1]
      const products = await searchProducts(searchQuery)
      assistantMessage.products = products

      // Remove the search command from the message content
      assistantMessage.content = assistantMessage.content.replace(/\[SEARCH_PRODUCTS: .+?\]/i, '')

      // Add information about the search results
      assistantMessage.content += `\n\nI've found ${products.length} products matching your search for "${searchQuery}". Here are the results:`
    }

    messages.value.push(assistantMessage)
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({ role: 'assistant', content: 'Sorry, there was an error processing your request.' })
  }
}

watch(messages, () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 0)
}, { deep: true })

onMounted(() => {
  messages.value.push({ role: 'assistant', content: 'Hello! How can I assist you today? I can help you find products if you\'re looking for something specific.' })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.user {
  background-color: #e1f5fe;
  align-self: flex-end;
}

.assistant {
  background-color: #f5f5f5;
  align-self: flex-start;
}

.input-container {
  display: flex;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.product-results {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.product-results ul {
  list-style-type: none;
  padding: 0;
}

.product-results li {
  margin-bottom: 5px;
}
</style>
