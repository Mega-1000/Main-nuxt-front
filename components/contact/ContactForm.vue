<template>
  <div
    class="w-screen max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8"
  >
    <form class="space-y-6" action="#">
      <h5 class="text-xl xl:text-2xl font-medium text-gray-900">
        Skontaktuj się telefonicznie z konsultantem
      </h5>
      <div>
        <label
          for="phone"
          class="block mb-2 text-sm lg:text-lg font-medium text-gray-900"
          >Numer telefonu</label
        >
        <input
          name="phone"
          type="phone"
          pattern="^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="123456789"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm lg:text-lg px-5 py-2.5 text-center"
      >
        Wyślij
      </button>
    </form>
  </div>
</template>
