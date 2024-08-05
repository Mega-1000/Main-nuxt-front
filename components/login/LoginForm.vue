<script setup lang="ts">
import { getToken, setCookie } from "~~/helpers/authenticator";

let emailInput = "";
let passwordInput = "";

const loading = useState(() => false);
const errorMessage = useState(() => "");

const router = useRouter();
const config = useRuntimeConfig().public;

const { $shopApi: shopApi } = useNuxtApp();
const userToken = useUserToken();
const emit = defineEmits(["loginFailed"]);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  loading.value = true;

  const params = {
    grant_type: "password",
    client_id: config.AUTH_CLIENT_ID,
    client_secret: config.AUTH_CLIENT_SECRET,
    username: emailInput,
    password: passwordInput,
    scope: "",
  };
  try {
    const res = await shopApi.post("oauth/token", params);
    setCookie(res.data);
    window.dispatchEvent(new CustomEvent('token-refreshed'));

    const redirect = router.currentRoute.value.query.redirect;
    await router.push(`${redirect ?? "/account"}`);
    userToken.value = getToken();
  } catch (err: any) {
    emit("loginFailed", {
      email: emailInput,
      password: passwordInput
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <form class="login-form" @submit="handleSubmit">
      <h1 class="login-title">Zaloguj się</h1>

      <div class="input-container">
        <label for="email" class="input-label">Email</label>
        <input
            type="email"
            name="email"
            id="email"
            class="login-input"
            placeholder="name@company.com"
            required
            v-model="emailInput"
            :disabled="loading"
        />
        <div class="input-gradient"></div> </div>

      <div class="input-container">
        <label for="password" class="input-label">Hasło</label>
        <div class="password-container">
          <input
              type="password"
              name="password"
              id="password"
              class="login-input"
              placeholder="•••••••••"
              required
              v-model="passwordInput"
              :disabled="loading"
          />
          <span class="password-toggle" :class="{ active: showPassword }">
            <i class="fas fa-eye"></i> </span>
        </div>
      </div>

      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>

      <div class="remember-me">
        <input type="checkbox" id="remember-me">
        <label for="remember-me">Pamiętaj mnie</label>
      </div>

      <button type="submit" class="login-button" :disabled="loading">
        Zaloguj się
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Global Styles */
html, body {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif; /* Replace with your preferred font */
  background-color: #f5f5f5; /* Light background */
}

/* Login Container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Login Form */
.login-form {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 350px;
}

/* Login Title */
.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Input Container */
.input-container {
  margin-bottom: 20px;
  position: relative;
}

/* Input Label */
.input-label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

/* Login Input */
.login-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
}

/* Error Message */
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* Remember Me */
.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Login Button */
.login-button {
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}
</style>
