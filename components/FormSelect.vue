<template>
  <v-select
    v-editable="blok"
    :autofocus="blok.auto_focus"
    :filled="blok.box"
    :chips="blok.use_chips"
    :clear-icon="blok.clear_icon ? 'mdi-' + blok.clear_icon : ''"
    :clearable="blok.clearable"
    :color="blok.color | lightOrDark(this.$vuetify.theme.dark)"
    :flat="blok.flat"
    :items="options"
    :label="blok.label"
    :mask="blok.mask"
    :multiple="blok.allow_multiple_selections"
    :name="blok.label"
    :outlined="blok.outline"
    :prepend-icon="blok.prepend_icon ? 'mdi-' + blok.prepend_icon : ''"
    :prepend-inner-icon="blok.inner_icon ? 'mdi-' + blok.inner_icon : ''"
    :rules="blok.required ? [v => !!v || blok.label + ' is required'] : []"
    :class="blok.helpers"
    :style="blok.style"
  ></v-select>
</template>

<script>
export default {
  props: ["blok"],
  computed: {
    options() {
      return this.blok.options.split(",");
    }
  }
};
</script>
