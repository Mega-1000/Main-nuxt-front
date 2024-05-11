<script setup>
import MagasinesMap from "~/components/MagasinesMap.vue";

const showZipCodeModal = !localStorage.getItem('zipCode');
</script>

<template>
  <AskUserForZipCodeStyrofoarms v-if="showZipCodeModal" />
  <div class="bg-gray-100 min-h-screen">
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Znajdź Najlepszy Styropian dla Twojego Projektu</h1>
        <p class="text-lg md:text-xl mb-8">Przeglądaj oferty od sprawdzonych producentów. Zapewniamy najniższe ceny na rynku i wysoką jakość obsługi.</p>
        <div class="flex justify-center space-x-4 font-bold">
          <nuxt-link to="/styropiany/elewacyjny" class="bg-white text-blue-600 py-2 px-4 rounded transition-colors duration-300 hover:bg-blue-600 hover:text-white">Elewacyjny</nuxt-link>
          <nuxt-link to="/styropiany/posadzkowy" class="bg-white text-blue-600 py-2 px-4 rounded transition-colors duration-300 hover:bg-blue-600 hover:text-white">Posadzkowy</nuxt-link>
          <nuxt-link to="/styropiany/fundamentowy" class="bg-white text-blue-600 py-2 px-4 rounded transition-colors duration-300 hover:bg-blue-600 hover:text-white">Fundamentowy</nuxt-link>
        </div>
      </div>
    </header>

    <main class="container mx-auto py-12">
      <section class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Porównaj ceny ponad 50 producentów</h2>
        <iframe
            title="Tabelka cen styropianów"
            src="https://admin.mega1000.pl/auctions/display-prices-table?zip-code=66-400"
            loading="lazy"
            style="height: 650px"
            class="w-full border-2 border-gray-200 rounded-lg shadow-lg"
        ></iframe>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Zobacz mapę punktów odbioru w całej Polsce</h2>
        <MagasinesMap />
      </section>

      <section id="instructions" class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Jak dokonać zakupu?</h2>
        <ol class="list-decimal list-inside text-lg md:text-xl">
          <li class="mb-2">Przeglądaj oferty producentów w działach: fundamentowy, posadzkowy i elewacyjny.</li>
          <li class="mb-2">Skorzystaj z kalkulatorów, aby obliczyć potrzebną ilość styropianu.</li>
          <li class="mb-2">Dodaj wybrane produkty do koszyka i przejdź do podsumowania.</li>
          <li class="mb-2">Uzupełnij dane i wyślij zamówienie do weryfikacji.</li>
          <li class="mb-2">Po zweryfikowaniu otrzymasz ofertę na swoim koncie.</li>
          <li class="mb-2">Skontaktuj się z przedstawicielem handlowym, aby omówić szczegóły transakcji.</li>
        </ol>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Jakiego producenta wybrać?</h2>
        <p class="text-lg md:text-xl mb-6">Wybór odpowiedniego producenta styropianu może być trudny. Oto kilka wskazówek:</p>
        <ul class="list-disc list-inside text-lg md:text-xl">
          <li class="mb-2">Unikaj opinii sprzedawców, którzy promują tylko wybranych producentów.</li>
          <li class="mb-2">Nie sugeruj się opiniami w internecie, które często są napisane na zlecenie firm.</li>
          <li class="mb-2">Zamiast tego, skonsultuj się z zaufanym ekspertem, który ma doświadczenie i wiedzę w tej dziedzinie.</li>
        </ul>
        <p class="text-lg md:text-xl">Na końcu podaliśmy nasze subiektywne spostrzeżenia, ale zachęcamy do podjęcia własnej decyzji na podstawie opinii z wiarygodnych źródeł.</p>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Gwarancja najniższej ceny</h2>
        <p class="text-lg md:text-xl mb-6">Przy zakupie powyżej 100m³ styropianu, najlepszą opcją jest system przetargowy:</p>
        <ol class="list-decimal list-inside text-lg md:text-xl">
          <li class="mb-2">Wybierz wstępnie preferowanego producenta i dodaj produkty do koszyka.</li>
          <li class="mb-2">Zaloguj się na swoje konto i rozpocznij przetarg.</li>
          <li class="mb-2">Przedstawiciele fabryk będą składać oferty, konkurując cenami.</li>
          <li class="mb-2">System gwarantuje najniższą możliwą cenę dzięki mechanizmowi przetargowemu.</li>
        </ol>
      </section>

      <section class="bg-blue-600 text-white py-12 mb-12">
        <div class="container mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Zarabiaj przez polecanie!</h2>
          <p class="text-lg md:text-xl mb-6">Zaprosić znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! To proste i przyjemne.</p>
          <nuxt-link to="/polec-znajomego" class="bg-white text-blue-600 py-2 px-4 rounded transition-colors duration-300 hover:bg-blue-800 hover:text-white">Zobacz swój panel polecania</nuxt-link>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Skontaktuj się z Nami</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="contact-card bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold mb-2">Kontakt Telefoniczny</h3>
            <p class="text-gray-600">Zadzwoń: <span class="font-bold">+48 507 925 963</span></p>
          </div>
          <div class="contact-card bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold mb-2">E-mail</h3>
            <p class="text-gray-600">Napisz na: <span class="font-bold">styropiany@ephpolska.pl</span></p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">Opinie Klientów</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="testimonial-card bg-white rounded-lg shadow-lg p-6">
            <blockquote class="text-gray-700 italic mb-4">
              "Firma oferuje produkty wysokiej jakości, a obsługa klienta jest wspaniała. Zakupy tutaj to czysta przyjemność!"
            </blockquote>
            <cite class="text-gray-600 font-bold">– Anna Nowak</cite>
          </div>
          <div class="testimonial-card bg-white rounded-lg shadow-lg p-6">
            <blockquote class="text-gray-700 italic mb-4">
              "Dzięki fachowej pomocy zespołu, wybrałem idealne rozwiązanie izolacyjne dla mojego domu. Jestem bardzo zadowolony z rezultatu."
            </blockquote>
            <cite class="text-gray-600 font-bold">– Piotr Wiśniewski</cite>
          </div>
          <div class="testimonial-card bg-white rounded-lg shadow-lg p-6">
            <blockquote class="text-gray-700 italic mb-4">
              "Korzystałem z ich usług kilkukrotnie i za każdym razem byłem pod wrażeniem rzetelności i zaangażowania. Polecam z całego serca!"
            </blockquote>
            <cite class="text-gray-600 font-bold">– Tomasz Zieliński</cite>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-gray-800 text-white py-12">
      <div class="container mx-auto text-center">
        <p class="text-sm mb-2">&copy; 2023 Mega1000. Wszystkie prawa zastrzeżone.</p>
        <nav>
          <ul class="flex justify-center space-x-4">
            <li><nuxt-link to="/polityka-prywatnosci" class="hover:text-gray-400 transition-colors duration-300">Polityka Prywatności</nuxt-link></li>
            <li><nuxt-link to="/regulamin" class="hover:text-gray-400 transition-colors duration-300">Regulamin</nuxt-link></li>
            <li><nuxt-link to="/kontakt" class="hover:text-gray-400 transition-colors duration-300">Kontakt</nuxt-link></li>
          </ul>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style>
body {
  scroll-behavior: smooth;
}
</style>
