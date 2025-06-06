<template v-if="item">
    <div class="text-left w-full font-light text-sm"  v-if="isStaff">
        <div class="youtubeLinks">
            <h3>Youtube:</h3>
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
            <button class="my-4 rounded text-white px-4 py-2 bg-green-500" @click="handleInput">
                Zapisz
            </button>
        </div>
    </div>
    <div v-else>
        <div class="youtube-info" v-if="props?.item?.youtube">
            <div class="item" v-for="(field, index) in youtube">
                <a :href="field.link" target="_blank" class="icon" v-if="field.link">
                    <img src="/youtube-icon.svg">
                    <div v-if="field.description" class="info" v-html="field.description.replace(/(?:\r\n|\r|\n)/g, '<br>')"></div>
                </a>
               
            </div>
        </div>
    </div>
</template>
  
  <script setup lang="ts">
import { log } from 'console';

  interface Props {
      item: any;
      isStaff: any;
  }
  
  const props = defineProps<Props>();
  
  const { $shopApi: shopApi } = useNuxtApp();
  const name = ref(props.item.name);
  const saveName = ref(props.item.save_name === 1);
  const saveImage = ref(props.item.save_image === "1");

  props.item.youtube = (props.item.youtube) ? props.item.youtube : [];
  const youtube = props.item.youtube;

  var addYoutubeField = () => {
    if(youtube.length >= 9) return;
    youtube.push({ link: '',description: '' });
  };

  var removeYoutubeItem = (item: any) => {
    youtube.splice(youtube.indexOf(item), 1);
  };
  
  const handleInput = (e: any) => {
    
    setTimeout(() => {
      const form = new FormData();
      form.append('name', name.value);
      form.append('save_name', String(saveName.value));
      form.append('save_image', String(saveImage.value));
      form.append('image', e.target.files ? e.target?.files[0] : null);
      form.append('youtube', JSON.stringify(youtube));
  
      if (e.target.files && e.target.files[0]) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      shopApi.post(`/api/products/${props.item.id}`, form);
    }, 100);
  };
  </script>

<style>
    .youtube-info{

    }
    .youtube-info .item{
        border-bottom: 1px solid #EEEEEE;
        padding: 5px 0;
        margin: 5px 0;
        
    }

    .youtube-info .item a{
        display: flex;
        line-height: 1.2;
    }

    .youtube-info .item img{
        width: auto;
        height: 25px;
        margin-right: 5px;
    }
    .youtube-info .item .info{
        font-size: 14px;
        font-weight: 400;
        padding-top: 3px;
    }
</style>
  