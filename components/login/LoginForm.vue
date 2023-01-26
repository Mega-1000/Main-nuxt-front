<template>
  <div
    class="w-screen max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8"
  >
    <form class="space-y-6" action="#">
      <h5 class="text-xl lg:text-2xl font-medium text-gray-900">
        Zaloguj się na swoje konto
      </h5>
      <div>
        <label
          for="email"
          class="block mb-2 text-sm lg:text-lg font-medium text-gray-900"
          >Email</label
        >
        <input
          type="email"
          name="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name@company.com"
          required
        />
      </div>
      <div>
        <label
          for="password"
          class="block mb-2 text-sm lg:text-lg font-medium text-gray-900"
          >Hasło (w domyśle numer telefonu)</label
        >
        <input
          type="password"
          name="password"
          id="password"
          placeholder="•••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm lg:text-lg px-5 py-2.5 text-center"
      >
        Zaloguj się
      </button>
    </form>
  </div>
</template>
