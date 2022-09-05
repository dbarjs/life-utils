import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    components,
    directives,
    defaults: {
      global: {
        rounded: "sm",
      },
      VDialog: {
        variant: "outlined",
      },
      VAutocomplete: {
        variant: "underlined",
      },
      VBanner: {
        color: "primary",
      },
      VBtn: {
        color: "primary",
        rounded: 0,
      },
      VCheckbox: {
        color: "secondary",
      },
      VCombobox: {
        variant: "underlined",
      },
      VSelect: {
        variant: "underlined",
      },
      VSlider: {
        color: "primary",
      },
      VTabs: {
        color: "primary",
      },
      VTextarea: {
        variant: "underlined",
      },
      VTextField: {
        variant: "underlined",
      },
    },

    theme: {
      themes: {
        light: {
          colors: {
            primary: "#3F51B5",
            "primary-darken-1": "#303F9F",
            "primary-lighten-1": "#C5CAE9",
            secondary: "#FF4081",
            "secondary-darken-1": "#F50057",
            "secondary-lighten-1": "#FF80AB",
            accent: "#009688",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
