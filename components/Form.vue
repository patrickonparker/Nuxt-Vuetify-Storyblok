<template>
  <v-card
    v-editable="blok"
    :color="blok.color | lightOrDark(this.$vuetify.theme.dark)"
    :dark="blok.dark"
    :elevation="blok.elevation"
    :flat="blok.flat"
    :height="blok.height"
    :hover="blok.hover"
    :max-height="blok.max_height"
    :max-width="blok.max_width"
    :min-height="blok.min_height"
    :min-width="blok.min_width"
    :raised="blok.raised"
    :width="blok.width"
    :class="blok.helpers"
    :style="blok.style"
  >
    <v-form
      v-editable="blok"
      v-model="valid"
      ref="form"
      method="POST"
      lazy-validation
      :action="'https://formsubmit.co/' + blok.recipient"
    >
      <component
        :key="blok._uid"
        v-for="blok in blok.cardimage"
        :blok="blok"
        :is="blok.component | dashify"
      ></component>
      <v-card-title v-if="blok.title != false">
        <component
          :key="blok._uid"
          v-for="blok in blok.title"
          :blok="blok"
          :is="blok.component | dashify"
        ></component>
      </v-card-title>
      <v-card-text>
        <component
          :key="blok._uid"
          v-for="blok in blok.form_fields"
          :blok="blok"
          :is="blok.component | dashify"
        ></component>
        <input type="hidden" name="_subject" value="New form submission!" />
        <input type="hidden" name="_next" :value="blok.redirect_to" />
        <input type="hidden" name="_replyto" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          @click="submit"
          :disabled="!valid"
          :color="blok.button_color | lightOrDark(this.$vuetify.theme.dark)"
          :dark="blok.button_dark"
          :outlined="blok.button_outline"
          :rounded="blok.button_round"
          large
          class="px-8"
          type="submit"
        >
          <component
            :key="blok._uid"
            v-for="blok in blok.button_icon"
            :blok="blok"
            :is="blok.component | dashify"
          ></component>
          {{blok.button_text}}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="clear" text color="red">clear</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  props: ["blok"],
  data: () => ({
    valid: false
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        axios.post("/api/submit", {
          name: this.name,
          email: this.email
        });
      }
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>
