<template>
  <v-img
    v-editable="blok"
    :alt="blok.alt"
    :aspect-ratio="aspectRatio"
    :contain="blok.contain"
    :gradient="blok.gradient"
    :height="blok.height"
    :lazy-src="blok.src ? optimizedImage : randomImage"
    :max-height="blok.maxheight"
    :max-width="blok.maxwidth"
    :min-height="blok.minheight"
    :min-width="blok.minwidth"
    :position="blok.hor + '% ' + blok.ver + '%'"
    :src="blok.src ? optimizedImage : randomImage"
    :width="blok.width"
    :class="blok.helpers"
    :style="blok.style"
  >
    <component
      :key="blok._uid"
      v-for="blok in blok.image_content"
      :blok="blok"
      :is="blok.component | dashify"
    ></component>
  </v-img>
</template>

<script>
export default {
  props: ["blok"],
  computed: {
    aspectRatio() {
      let ratio = this.blok.aspectratio;
      if (ratio.includes("/")) {
        let ratioValues = ratio.split("/");
        return ratioValues[0] / ratioValues[1];
      } else {
        return this.blok.aspectratio;
      }
    },
    randomImage() {
      let width = this.blok.width
        ? this.blok.width
        : Math.floor(Math.random() * (800 - 600) + 600);
      let height = this.blok.height
        ? this.blok.height
        : Math.floor(Math.random() * (800 - 400) + 300);
      let searchTerm = this.blok.placeholder_image_search_term;
      let service = searchTerm ? "loremflickr.com" : "picsum.photos";
      return `https://${service}/${width}/${height}/${searchTerm}`;
    },
    optimizedImage() {
      let isStoryblok = this.blok.src.includes("a.storyblok.com");
      let validType =
        this.blok.src.includes("jpeg") ||
        this.blok.src.includes("jpg") ||
        this.blok.src.includes("png");
      let noOverride = this.blok.do_not_use_image_service == false;
      if (isStoryblok && validType && noOverride) {
        let imageService = "//img2.storyblok.com/";
        let options = `${this.blok.optiwidth}x${
          this.blok.height ? this.blok.height : 0
        }${this.blok.smart_crop ? "/smart" : ""}`;
        let path = this.blok.src.replace("//a.storyblok.com", "");
        return imageService + options + path;
      } else {
        return this.blok.src;
      }
    }
  }
};
</script>
