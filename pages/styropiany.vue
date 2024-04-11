<template>
  <div>
    <header class="header py-4 shadow-sm">
      <div class="container mx-auto flex justify-between items-center">
        <a href="/" class="text-xl font-semibold">Eph Polska</a>
        <nav class="flex space-x-4">
          <a href="#" class="hover:text-blue-500">Styropiany elewacyjne</a>
          <a href="#" class="hover:text-blue-500">Styropiany posadskowe</a>
          <a href="#" class="hover:text-blue-500">Styropiany fundamentowe</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero-section py-16 px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Znajdź Idealny Styropian u Nas</h1>
        <p class="text-lg md:text-xl mb-8">
          Przeglądaj oferty od ponad 50 sprawdzonych producentów styropianu. Zapewniamy konkurencyjne ceny i wysoką jakość.
        </p>
        <a href="#" class="btn-primary py-3 px-8 rounded-full inline-block transition duration-300">Odkryj Oferty</a>
      </section>

      <section class="py-16 px-4">
        <div class="container mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
                class="feature-card rounded-lg shadow-lg p-6 flex flex-col justify-center items-center space-y-4 transition ease-in-out duration-150"
            >
              <h2 class="text-xl font-semibold">Innowacyjny System Przetargowy</h2>
              <p>
                Nasz zaawansowany system przetargowy umożliwia uzyskanie najlepszych ofert dopasowanych do Twoich potrzeb.
              </p>
            </div>
            <div
                class="feature-card rounded-lg shadow-lg p-6 flex flex-col justify-center items-center space-y-4 transition ease-in-out duration-150"
            >
              <h2 class="text-xl font-semibold">Konkurencyjne Ceny</h2>
              <p>
                Gwarantujemy atrakcyjne ceny dzięki współpracy z wieloma producentami. Znajdź idealne rozwiązanie w budżecie.
              </p>
            </div>
            <div
                class="feature-card rounded-lg shadow-lg p-6 flex flex-col justify-center items-center space-y-4 transition ease-in-out duration-150"
            >
              <h2 class="text-xl font-semibold">Szeroki Wybór Produków</h2>
              <p>
                Od styropianów elewacyjnych po fundamentowe – nasz asortyment obejmuje wszystkie typy styropianu, dostosowane do różnych potrzeb.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 px-4 bg-gray-700 text-white">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">
            Zapoznaj się z tabelą cen od ponad 50 producentów!
          </h2>
          <!-- IFrame for backend integration -->
          <iframe
              title="Tabelka cen styropianów"
              data-src="https://admin.mega1000.pl/auctions/display-prices-table?zip-code=66-400"
              loading="lazy"
              style="height: 650px"
              class="w-full border border-gray-600"
          ></iframe>
        </div>
      </section>

      <section class="py-16 px-4 bg-gray-100">
        <div class="container mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-8">Jak Działa Nasz System Przetargowy</h2>
          <p class="mb-8">
            Proces jest prosty i przejrzysty – zacznij od dodania produktu do koszyka, a my zajmiemy się resztą, gwarantując najlepszą ofertę.
          </p>
          <!-- Detailed steps or an interactive guide could be added here -->
        </div>
      </section>

      <section class="py-16 px-4 bg-gray-700 text-white">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Zarabiaj przez polecanie!</h2>
          <!-- IFrame for backend integration -->
          <p class="mb-8">
            Mamy świetną wiadomość: zaproś do nas dowolną ilość znajomych, którzy jeszcze nie kupowali styropianów na naszej stronie, i odbierz 25 zł na każde zamówienie nowego użytkownika! Twoje bonusy automatycznie zamienią się na zniżki przy kolejnych zakupach. To proste!
          </p>
          <a href="#" class="btn-primary py-3 px-8 rounded-full inline-block transition duration-300">Odkryj Oferty</a>
        </div>
      </section>

      <section class="py-16 px-4">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Skontaktuj się z Nami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="contact-card rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold mb-4">Kontakt Telefoniczny</h3>
              <p>Zadzwoń do nas: <span class="font-semibold">+48 507 925 963</span></p>
            </div>
            <div class="contact-card rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-semibold mb-4">E-mail</h3>
              <p>Skontaktuj się mailowo: <span class="font-semibold">styropiany@ephpolska.pl</span></p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 px-4 bg-gray-100">
        <div class="container mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Opinie Klientów</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="testimonial-card rounded-lg shadow-lg p-6">
              <blockquote>
                "Jakość produktów i obsługa klienta są na najwyższym poziomie. Polecam każdemu, kto szuka niezawodnych rozwiązań izolacyjnych."
              </blockquote>
              <cite>– Jan Kowalski</cite>
            </div>
            <div class="testimonial-card rounded-lg shadow-lg p-6">
              <blockquote>
                "Jakość produktów i obsługa klienta są na najwyższym poziomie. Polecam każdemu, kto szuka niezawodnych rozwiązań izolacyjnych."
              </blockquote>
              <cite>– Jan Kowalski</cite>
            </div>
            <div class="testimonial-card rounded-lg shadow-lg p-6">
              <blockquote>
                "Jakość produktów i obsługa klienta są na najwyższym poziomie. Polecam każdemu, kto szuka niezawodnych rozwiązań izolacyjnych."
              </blockquote>
              <cite>– Jan Kowalski</cite>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer py-4 text-center">
      <p>&copy; 2024 EPH Polska. Wszystkie prawa zastrzeżone.</p>
      <p>Twój partner w zakresie efektywnych i ekonomicznych rozwiązań izolacyjnych.</p>
    </footer>
  </div>
</template>
