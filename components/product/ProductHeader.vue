<script setup lang="ts">
import { defaultImgSrc } from "~~/helpers/buildImgRoute";
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { log } from "console";

interface Props {
  description?: string;
  imgSrc?: string;
  name: string;
  editable: boolean;
  category: any;
}

const { description, imgSrc, name, category } = defineProps<Props>();
const realDescription = description?.replace(/\|/gim, "\n");
const { $buildImgRoute: buildImgRoute } = useNuxtApp();
const { $shopApi: shopApi } = useNuxtApp();

const editImage = ref(false);
const formData = ref();
const checkboxes = reactive({
  name: category?.currentProduct.save_name,
  description: category?.currentProduct.save_description,
  image: category?.currentProduct.save_image,
});


category.currentProduct.youtube = (category.currentProduct.youtube) ? category.currentProduct.youtube : [];
const youtube = category.currentProduct.youtube;

var addYoutubeField = () => {
  if(youtube.length >= 9) return;
  youtube.push({ link: '',description: '' });
};

var removeYoutubeItem = (item: any) => {
  youtube.splice(youtube.indexOf(item), 1);
};


const [parent] = useAutoAnimate();
const router = useRouter();

const saveImage = async (e: any) => {
  const file = e.target[0].files[0];
  const formData = new FormData();
  formData.append("image", file);
  formData.append("category", category?.currentProduct.id)
  await shopApi.post("api/change-image", formData);

  window.location.reload();
};

const saveNameAndDescription = () => {
  const name = formData.value.querySelector("h4")?.innerText;
  const description = formData.value.querySelector("p")?.innerText;
console.log(youtube);

  setTimeout(() => {
    shopApi.post("api/update-category", {
      name,
      description,
      category: category?.currentProduct.id,
      save_name: checkboxes.name,
      save_description: checkboxes.description,
      save_image: checkboxes.image,
      youtube: youtube
    });
  }, 5)
}

const deleteCategory = async () => {
  await shopApi.delete(`api/categories/delete/${category?.currentProduct.id}`);
  
  router.push("/");
}
</script>

<template>
  <div class="flex justify-center">
    <div ref="formData"
      class="justify-center items-center bg-white shadow-lg rounded-lg sm:flex flex-row w-full max-w-screen-xl mx-3 lg:mx-6 xl:mx-8">
      <img :src="buildImgRoute(imgSrc!)" @error="(e: any) => (e.target!.src = defaultImgSrc)" alt="img" title="img"
        class="object-cover rounded-t-lg sm:w-[45%]" />
      <div class="w-full p-4 justify-start flex flex-col">
        <h4 class="border-b-2 text-3xl" :contenteditable="editable" role="input" @input="saveNameAndDescription">{{ name
        }}</h4>
        
        <p class="my-4" :contenteditable="editable" @input="saveNameAndDescription" v-html="realDescription"></p>
        <div v-if="editable">
          <button class="bg-blue-500 rounded text-white px-4 py-2" @click="editImage = !editImage"> Edytuj
            zdjęcie
          </button>
          
          <button class="bg-red-500 rounded text-white px-4 py-2" @click="deleteCategory">Usuń kategorię</button>
        </div>
          
        <div ref="parent" v-if="editable">
          <div class="m-4">
            <div>
              <input @input="saveNameAndDescription" type="checkbox" v-model="checkboxes.name"> Zapisuj nazwę z csv
            </div>
            <div>
              <input @input="saveNameAndDescription" type="checkbox" v-model="checkboxes.description"> Zapisuj opis z csv
            </div>
            <div>
              <input @input="saveNameAndDescription" type="checkbox" v-model="checkboxes.image"> Zapisuj zdjęcie z csv
            </div>
          </div>
          <div class="youtubeLinks">
            <div class="mb-1" v-for="(field, index) in youtube">
              <div>{{ (index+1) }}
                <button class="my-4 rounded text-white px-2 bg-red-500" @click="removeYoutubeItem(field)">
                  x
                </button>
              </div>
              <div class="form-gorup"><input class="form-control" v-model="field.link" placeholder="Link"></div>
              <div><textarea class="form-control" v-model="field.description" placeholder="Opis filmu"></textarea></div>
              <hr>
            </div>

            <button class="my-4 rounded text-white px-4 py-2 bg-blue-500" @click="addYoutubeField">
              Dodaj link
            </button>
            <button class="my-4 rounded text-white px-4 py-2 bg-green-500" @click="saveNameAndDescription">
              Zapisz
            </button>
          </div>
          <div v-if="editImage">
            <form @submit.prevent="saveImage" class="mt-4 text-center border rounded">
              <div class="text-2xl mb-4">
                Prześlij nowe zdjęcie
              </div>
              <div>
                <input type="file" />
              </div>
              <div>
                <button type="submit" class="my-4 rounded text-white px-4 py-2 bg-blue-500">Zapisz</button>
              </div>
            </form>
          </div>
        </div>
        <div v-else>
            <div class="youtube-info" v-if="youtube">
                <div class="item" v-for="(field, index) in youtube">
                    <a :href="field.link" target="_blank" class="icon" v-if="field.link">
                        <img src="/youtube-icon.svg">
                        <div v-if="field.description" class="info" v-html="field.description.replace(/(?:\r\n|\r|\n)/g, '<br>')"></div>
                    </a>
                  
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
@media screen and (max-width: 640px) {
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
.youtubeLinks hr{
  margin: 15px 0;
}
.youtubeLinks input,
.youtubeLinks textarea{
  border-bottom: 1px solid #EEEEEE;
  width: 100%;
  padding: 10px 0;
}
.youtubeLinks textarea{
  height: 80px;
}
img {
  max-width: 300px;
  max-height: 300px;
}
  
</style>