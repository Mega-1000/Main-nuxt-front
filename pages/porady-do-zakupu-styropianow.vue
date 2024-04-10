<script setup>
import { ref } from 'vue';

// State to track if the iframe is loading
const isLoading = ref(true);

const currentZipCode = localStorage.getItem('zipCode');

// Function to call when the iframe has finished loading
function onIframeLoad() {
  isLoading.value = false;
}
</script>

<template>
  Jeśli chcesz wiedzieć jaki styropian wybrać lub nie wiesz jak go zamówić sprawdź tekst na dole lub kliknij <a style="color: #1e40af" href="#porady">tutaj</a>
  <div style="position: relative; width: 70%; margin: 0 auto; height: 80vh;">
    <!-- Loader displayed while isLoading is true -->
    <div v-if="isLoading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: rgba(255, 255, 255, 0.8); z-index: 100; font-weight: bold; font-size: larger">
      <span>Ładowanie tabeli, proszę czekać...</span>
    </div>

    <!-- IFrame with the load event listener -->
    <iframe :src="`https://admin.mega1000.pl/auctions/display-prices-table?zip-code=${currentZipCode}`" style="width: 100%; height: 100%;" @load="onIframeLoad"></iframe>
  </div>

  <div id="porady" class="mt-4">
    1. JAKIEGO PRODUCENTA STYROPIANU WYBRAĆ
    2. JAK DOKONAĆ WYCENY I ZAKUPU STYROPIANU
    3. GWARANCJA NAJNIŻEJSZEJ CENY - SYSTEM PRZETARGOWY ZAKUPU STYROPIANU

    1. JAKIEGO PRODUCENTA STYROPIANU WYBRAĆ
    W przypadku wyboru danego gatunku styropianu o identycznych danych technicznych, każda z fabryk może wyprodukować go pod względem jakości w różnym stopniu
    Niemal wszyscy sprzedawcy namawiają na zakup tego producenta, na którym mają największy zysk.
    Nasze podejście jest całkowicie odmienne i innowacyjne, ponieważ nie zarabiamy w ogóle na tym produkcie i jest nam całkowicie obojętne, którego producenta wybierzecie.
    Zakup możecie dokonać bezpośrednio z fabryki lub przez przedstawiciela wskazanego przez fabrykę lub przez nasz system, wybór pozostawiamy Wam.
    Samodzielny wybór jest bardzo trudny, którego producenta wybrać, ale poniżej podajemy na jakie opinie należy zwrócić uwagę:
    - sprzedawców, którzy niemal zawsze sprzedają tych producentów, na których mają największy zysk, łatwo to zauważyć po tym, że mają u siebie tylko kilku wybranych, najbardziej dla siebie korzystnych producentów.
    - opinie internetowe, które są bardzo często lobbowane i pisane na zlecenie firm produkcyjnych jako super zadowoleni klienci, czytanie ich wprowadza tylko w błąd.
    - pseudoznawców, którzy nie mają wiedzy i doświadczenia lub mają korzyść z Państwa wyboru.
    Dlatego z naszej strony proponujemy, aby dowiedzieć się u kogoś mocno zaufanego, który nie będzie miał żadnej korzyści z Państwa wyboru, aczkolwiek będzie posiadał dużą wiedzę i doświadczenie.
    Dla osób, które jednak chcą otrzymać jakąś informację na temat danego producenta, podajemy na samym dole nasze spostrzeżenia, ale prosimy pamiętać, że jest to nasza subiektywna opinia, i prosimy najlepiej skorzystać z opinii z innych zaufanych źródeł.

    2. JAK DOKONAĆ WYCENY I ZAKUPU STYROPIANU

    Styropiany znajdują się w 3 działach
    160 - fundamentowy
    300 - posadzkowy
    320 - elewacyjny
    Przed zakupem warto przejrzeć sobie tabele wszystkich kilkudziesięciu producentów która znajduję się w każdym powyższych działów
    Następnie za pomocą kalkulatorów znajdujących się przy każdym asortymencie w łatwy sposób można dokonać obliczeń potrzebnego styropianu w m2 m3 czy też w opakowaniach handlowych.
    Po dokonaniu obliczeń i wrzuceniu do koszyka odpowiedniego asortymentu na górze znajduje się ikona koszyka na którą trzeba kliknąć.
    Po kliknięciu otrzymamy spis całości asortymentu który został dokonany w którym można jeszcze dokonać korekty pod względem ilościowym.
    Na końcu prosimy uzupełnić niezbędne dane i wysłać nam do sprawdzenia poprawności.
    Bezzwłocznie po jego otrzymaniu sprawdzimy pod tym kątem po czym odeślemy informacje na e maila w przypadku gdy oferta zostanie już przygotowana.
    Ofertę taką można będzie sprawdzić po zalogowaniu się na swoje konto na naszej stronie.
    Szczegóły transakcji omawiacie z przedstawicielem handlowym danej fabryki z którym kontakt będziecie mieć poprze chata lub telefon według uznania.
    Istnieje możliwość płatności jako niewielka zaliczka i reszta płatność przy dostawie.

    3. GWARANCJA NAJNIŻEJSZEJ CENY - SYSTEM PRZETARGOWY ZAKUPU STYROPIANU

    W przypadku zakupu dużych ilości powyżej 100m3 najlepszą formą zakupu jest tak zwany przetarg.
    W tym przypadku proponujemy wybrać z tabeli wstępnie ulubionego producenta po czym wrzucić do koszyka wybrany asortyment i wysłać do systemu.
    Następnie zalogować się na swoje konto na naszej stronie po czym dokonać za pomocą przycisku ROZPOCZNIJ PRZETARG
    System przekaże informacje do przedstawicieli wszystkich fabryk którzy do zakończenia przetargu będą w nim uczestniczyć w formie jak na giełdzie czyli każdy będzie informowany o pojawieniu się nowej korzystniejszej oferty cenowo niż była.
    Gwarantuje to najniższa możliwą cenę ponieważ nawet w przypadkach z nimi wieloletniej współpracy z naszego doświadczenia wiemy że i tak zawyżają wam cenę ponieważ brak konkurencji która zmusza do jej obniżenia.



    NASZE OPINIE NA TEMAT PRODUCENTÓW STYROPIANU
    albaterm - dobry jakościowo styropian w dobrej cenie
    arsanit - standardowy styropian w przeciętnej cenie
    austrotherm - bardzo dobry styropian w wysokiej cenie
    besser - bardzo słaby styropian w niskie cenie
    domstyr- standardowy styropian w przeciętnej cenie
    ekobud-zakrzewo- według własnego uznania
    enerpor - słaby styropian przeważnie w niskie cenie
    eurostyr- standardowy styropian przeważnie w dobrej cenie
    eurostyropian- standardowy styropian przeważnie w przeciętnej cenie
    eurotermika - standardowy styropian przeważnie w dobrej cenie
    FWS -  umiarkowana jakość bardzo dobra cena
    genderka - standardowy styropian przeważnie w słabej cenie
    grastyr - standardowy styropian przeważnie w przeciętnej cenie
    inthermo - bardzo słaby styropian w niskie cenie
    izoline - dobry jakościowo styropian w przeciętnej cenie
    izolbet - standardowy styropian w zawyżonej cenie
    izoterm  -  umiarkowana jakość bardzo dobra cena
    justyr - dobry jakościowo styropian w dobrej cenie
    knauf - dobry styropian w bardzo zawyżonej cenie zdecydowanie lepiej kupić styropmin lub austrotherm
    krasbud - standardowy styropian przeważnie w przeciętnej cenie
    krolczyk- według własnego uznania
    neotherm- standardowy styropian przeważnie w przeciętnej cenie
    NTB- standardowy styropian przeważnie w przeciętnej cenie
    paneltech - standardowy styropian przeważnie w dobrej cenie
    piotrowski -  umiarkowana jakość bardzo dobra cena
    polstyr - standardowy styropian przeważnie w słabej cenie
    sonarol - standardowy styropian przeważnie w dobrej cenie
    styrhop -  umiarkowana jakość bardzo dobra cena
    styrmann - standardowy styropian przeważnie w przeciętnej cenie
    styropak - standardowy styropian przeważnie w przeciętnej cenie
    styropoz - standardowy styropian przeważnie w dobrej cenie
    styromap - standardowy styropian przeważnie w dobrej cenie
    styropianex - standardowy styropian przeważnie w dobrej cenie
    styropian plus - dobry jakościowo styropian w dobrej cenie
    styropmin - bardzo dobry styropian w wysokiej cenie
    swisspor - dobry jakościowo styropian przeważnie w przeciętnej cenie
    termex - standardowy styropian przeważnie w dobrej cenie
    termoorganika - dobry jakościowo w mocno zawyżonej cenie zdecydowanie lepiej wziąść styropmin austrotherm lub swisspor
    thermica - standardowy styropian przeważnie w przeciętnej cenie
    yetico - standardowy styropian przeważnie w przeciętnej cenie
    tyron - standardowy styropian przeważnie w przeciętnej cenie
  </div>
</template>
