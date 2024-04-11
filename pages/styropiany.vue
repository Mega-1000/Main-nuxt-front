<template>
  <div>
    <header class="header py-6 shadow-md bg-white">
      <div class="container mx-auto flex justify-between items-center">
        <a href="/" class="text-2xl font-bold text-gray-800">Eph Polska</a>
        <nav class="flex space-x-6">
          <a href="https://mega1000.pl/100styropiany-elewacyjne/101" class="text-gray-700 font-medium hover:text-blue-600 transition-colors">Styropiany elewacyjne</a>
          <a href="https://mega1000.pl/10styropiany/49" class="text-gray-700 font-medium hover:text-blue-600 transition-colors">Styropiany posadskowe</a>
          <a href="https://mega1000.pl/--30termoizolacja-fundamentow/4" class="text-gray-700 font-medium hover:text-blue-600 transition-colors">Styropiany fundamentowe</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero-section py-24 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div class="container mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">Znajdź Idealny Styropian u Nas</h1>
          <p class="text-lg md:text-xl mb-10">
            Przeglądaj oferty od ponad 50 sprawdzonych producentów styropianu. Zapewniamy konkurencyjne ceny i wysoką jakość.
          </p>
          <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-10 rounded-full inline-block transition-colors duration-300">Odkryj Oferty</a>
        </div>
      </section>

      <section class="py-20 px-4">
        <div class="container mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
                class="feature-card bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center space-y-4 transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="bg-blue-500 rounded-full p-4 mb-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold">Innowacyjny System Przetargowy</h2>
              <p class="text-gray-600">
                Nasz zaawansowany system przetargowy umożliwia uzyskanie najlepszych ofert dopasowanych do Twoich potrzeb.
              </p>
            </div>
            <div
                class="feature-card bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center space-y-4 transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="bg-blue-500 rounded-full p-4 mb-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      fill-rule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.889l-1 12A1 1 0 004 21h12a1 1 0 00.994-1.111l-1-12A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4zm-6 8a1 1 0 112 0 1 1 0 01-2 0zm10 0a1 1 0 112 0 1 1 0 01-2 0z"
                      clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold">Konkurencyjne Ceny</h2>
              <p class="text-gray-600">
                Gwarantujemy atrakcyjne ceny dzięki współpracy z wieloma producentami. Znajdź idealne rozwiązanie w budżecie.
              </p>
            </div>
            <div
                class="feature-card bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center space-y-4 transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="bg-blue-500 rounded-full p-4 mb-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold">Szeroki Wybór Produków</h2>
              <p class="text-gray-600">
                Od styropianów elewacyjnych po fundamentowe – nasz asortyment obejmuje wszystkie typy styropianu, dostosowane do różnych potrzeb.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">
            Zapoznaj się z tabelą cen od ponad 50 producentów!
          </h2>
          <iframe
              title="Tabelka cen styropianów"
              data-src="https://admin.mega1000.pl/auctions/display-prices-table?zip-code=66-400"
              loading="lazy"
              style="height: 650px"
              class="w-full border-2 border-gray-200 rounded-lg shadow-lg"
          ></iframe>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-10">Jak Działa Nasz System Przetargowy</h2>
          <p class="text-lg md:text-xl mb-10">
            Proces jest prosty i przejrzysty – zacznij od dodania produktu do koszyka, a my zajmiemy się resztą, gwarantując najlepszą ofertę.
          </p>
          <!-- Detailed steps or an interactive guide could be added here -->
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-800 text-white">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Zarabiaj przez polecanie!</h2>
          <p class="text-lg md:text-xl mb-10">
            Mamy świetną wiadomość: zaproś do nas dowolną ilość znajomych, którzy jeszcze nie kupowali styropianów na naszej stronie, i odbierz 25 zł na każde zamówienie nowego użytkownika! Twoje bonusy automatycznie zamienią się na zniżki przy kolejnych zakupach. To proste!
          </p>
          <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-10 rounded-full inline-block transition-colors duration-300">Odkryj Oferty</a>
        </div>
      </section>

      <section class="py-20 px-4">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Skontaktuj się z Nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">Kontakt Telefoniczny</h3>
              <p class="text-gray-600">Zadzwoń do nas: <span class="font-bold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4">E-mail</h3>
              <p class="text-gray-600">Skontaktuj się mailowo: <span class="font-bold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center">Opinie Klientów</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="testimonial-card bg-white rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Jakość produktów i obsługa klienta są na najwyższym poziomie. Polecam każdemu, kto szuka niezawodnych rozwiązań izolacyjnych."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Jan Kowalski</cite>
            </div>
            <div class="testimonial-card bg-white rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Jakość produktów i obsługa klienta są na najwyższym poziomie. Polecam każdemu, kto szuka niezawodnych rozwiązań izolacyjnych."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Jan Kowalski</cite>
            </div>
            <div class="testimonial-card bg-white rounded-lg shadow-lg p-8">
              <blockquote class="text-gray-700 italic mb-4">
                "Jakość produktów i obsługa klienta są na najwyższym poziomie. Polecam każdemu, kto szuka niezawodnych rozwiązań izolacyjnych."
              </blockquote>
              <cite class="text-gray-600 font-bold">– Jan Kowalski</cite>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer py-6 bg-gray-800 text-white text-center">
      <p>&copy; 2024 EPH Polska. Wszystkie prawa zastrzeżone.</p>
      <p>Twój partner w zakresie efektywnych i ekonomicznych rozwiązań izolacyjnych.</p>
    </footer>
  </div>
</template>
