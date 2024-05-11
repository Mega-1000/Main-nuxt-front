<script setup>
  import MagasinesMap from "~/components/MagasinesMap.vue";

  const showZipCodeModal = !localStorage.getItem('zipCode');
</script>

<template>
  <AskUserForZipCodeStyrofoarms v-if="showZipCodeModal" />
  <div>
    <main>
      <section class="hero-section py-24 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div class="container mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">Znajdź Najlepszy Styropian dla Twojego Projektu</h1>
          <p class="text-lg md:text-xl mb-10">
            Przeglądaj oferty od sprawdzonych producentów. Zapewniamy najniższe ceny na rynku i wysoką jakość obsługi.
          </p>
          <div class="my-6 font-extrabold text-xl">
            Wybierz kategorię styropianu
          </div>

          <div class="flex justify-between md:w-[40%] mx-auto font-bold">
            <nuxt-link class="rounded bg-white px-4 py-2 text-black"  href="/100styropiany-elewacyjne/101">
              Elewacyjny
            </nuxt-link>
            <nuxt-link class="rounded bg-white px-4 py-2 text-black"  href="/10styropiany/49">
              Posadzkowy
            </nuxt-link>
            <nuxt-link class="rounded bg-white px-4 py-2 text-black" href="/----10styropiany-wodoodporne/5">
              Fundamentowy
            </nuxt-link>
          </div>

          <div class="mt-28 font-extrabold text-2xl">
            <a href="#instructions" class="rounded bg-white px-8 py-4 text-black">
              Zobacz szczegółowe informacje na temat systemu
            </a>
          </div>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">
            Porównaj ceny ponad 50 producentów
          </h2>
          <iframe
              title="Tabelka cen styropianów"
              src="https://admin.mega1000.pl/auctions/display-prices-table?zip-code=66-400"
              loading="lazy"
              style="height: 650px"
              class="w-full border-2 border-gray-200 rounded-lg shadow-lg"
          ></iframe>
        </div>
      </section>

      <section class="py-20 px-4 bg-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">
            Zobacz mapę punktów odbioru w całej polsce
          </h2>
          <MagasinesMap />
        </div>
      </section>


      <section class="py-20 px-4 bg-gray-100" id="instructions">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-10">Jak dokonać zakupu?</h2>
          <p class="text-lg md:text-xl mb-10 text-left">
            1. Przeglądaj oferty producentów w działach: fundamentowy, posadzkowy i elewacyjny.<br>
            2. Skorzystaj z kalkulatorów, aby obliczyć potrzebną ilość styropianu.<br>
            3. Dodaj wybrane produkty do koszyka i przejdź do podsumowania.<br>
            4. Uzupełnij dane i wyślij zamówienie do weryfikacji.<br>
            5. Po zweryfikowaniu otrzymasz ofertę na swoim koncie.<br>
            6. Skontaktuj się z przedstawicielem handlowym, aby omówić szczegóły transakcji.
          </p>
        </div>
      </section>

      <section class="py-20 px-4 bg-white">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-10">Jakiego producenta wybrać?</h2>
          <p class="text-lg md:text-xl mb-10 text-left">
            Wybór odpowiedniego producenta styropianu może być trudny. Oto kilka wskazówek:<br>
            - Unikaj opinii sprzedawców, którzy promują tylko wybranych producentów.<br>
            - Nie sugeruj się opiniami w internecie, które często są napisane na zlecenie firm.<br>
            - Zamiast tego, skonsultuj się z zaufanym ekspertem, który ma doświadczenie i wiedzę w tej dziedzinie.<br>
            Na końcu podaliśmy nasze subiektywne spostrzeżenia, ale zachęcamy do podjęcia własnej decyzji na podstawie opinii z wiarygodnych źródeł.
          </p>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-10">Gwarancja najniższej ceny</h2>
          <p class="text-lg md:text-xl mb-10 text-left">
            Przy zakupie powyżej 100m³ styropianu, najlepszą opcją jest system przetargowy:<br>
            1. Wybierz wstępnie preferowanego producenta i dodaj produkty do koszyka.<br>
            2. Zaloguj się na swoje konto i rozpocznij przetarg.<br>
            3. Przedstawiciele fabryk będą składać oferty, konkurując cenami.<br>
            4. System gwarantuje najniższą możliwą cenę dzięki mechanizmowi przetargowemu.
          </p>
        </div>
      </section>

      <section class="py-20 px-4 bg-blue-600 text-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Zarabiaj przez polecanie!</h2>
          <p class="text-lg md:text-xl mb-10">
            Zaprosić znajomych, a otrzymasz 30 zł zniżki za każdego nowego użytkownika! To proste i przyjemne.
          </p>
          <a href="https://mega1000.pl/polec-znajomego" class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-4 px-10 rounded-full inline-block transition-colors duration-300">Zobacz swój panel polecania</a>
        </div>
      </section>
      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Skontaktuj się z Nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">Kontakt Telefoniczny</h3>
              <p class="text-gray-600">Zadzwoń: <span class="font-bold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">E-mail</h3>
              <p class="text-gray-600">Napisz na: <span class="font-bold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 px-4 bg-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Opinie Klientów</h2>
          <div class="grid grid-cols-1md:grid-cols-3 gap-8">
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Firma oferuje produkty wysokiej jakości, a obsługa klienta jest wspaniała. Zakupy tutaj to czysta przyjemność!"
              </blockquote>
              <cite class="text-gray-600 font-bold">– Anna Nowak</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Dzięki fachowej pomocy zespołu, wybrałem idealne rozwiązanie izolacyjne dla mojego domu. Jestem bardzo zadowolony z rezultatu."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Piotr Wiśniewski</cite>
            </div>
            <div class="testimonial-card bg-gray-100 rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Korzystałem z ich usług kilkukrotnie i za każdym razem byłem pod wrażeniem rzetelności i zaangażowania. Polecam z całego serca!"
              </blockquote>
              <cite class="text-gray-600 font-bold">– Tomasz Zieliński</cite>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
  * {
    scroll-behavior: smooth;
  }
</style>
