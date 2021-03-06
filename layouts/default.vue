<template>
	<!-- Vuetify Application Wrapper -->
	<v-app>
		<!-- Background Video -->
		<div class="video-wrapper" :style="`align-items: ${blok.video_alignment};`">
			<video
				v-if="blok.video_webm || blok.video_mp4"
				playsinline
				autoplay
				muted
				loop
				class="hidden-sm-and-down"
			>
				<source :src="blok.video_webm" type="video/webm" />
				<source :src="blok.video_mp4" type="video/mp4" />
			</video>
		</div>
		<!-- App Drawer -->
		<v-navigation-drawer
			v-if="showDrawer ? true : false"
			v-model="sidebar"
			app
			:clipped="!blok.sidebar_prominent"
			:class="blok.sidebar_helpers"
			:color="blok.sidebar_color | lightOrDark(this.$vuetify.theme.dark)"
			:dark="blok.sidebar_dark"
			:style="blok.sidebar_style"
			:width="blok.sidebar_width"
		>
			<component
				v-for="blok in blok.sidebar_content"
				:key="blok._uid"
				:blok="blok"
				:is="blok.component | dashify"
			></component>
		</v-navigation-drawer>
		<!-- App Toolbar -->
		<v-app-bar
			v-if="appBarNullCheck"
			app
			:clipped-left="!blok.sidebar_prominent"
			:color="blok.toolbar_color | lightOrDark(this.$vuetify.theme.dark)"
			:dark="blok.toolbar_dark"
			:height="blok.toolbar_height"
			:flat="blok.toolbar_flat"
			:dense="blok.toolbar_dense"
			:class="blok.toolbar_helpers"
			:style="blok.toolbar_style"
		>
			<v-app-bar-nav-icon
				v-if="showDrawer"
				@click="sidebar = !sidebar"
				aria-label="Toggle the Navigation Sidebar"
			></v-app-bar-nav-icon>
			<component
				:key="blok._uid"
				v-for="blok in blok.toolbar_content"
				:blok="blok"
				:is="blok.component | dashify"
			></component>
		</v-app-bar>
		<!-- App Content -->
		<v-content>
			<nuxt />
		</v-content>
		<!-- App Footer -->
		<v-footer
			v-if="blok.footer_content != false"
			app
			:inset="blok.footer_inset"
			:absolute="blok.footer_inset"
			:color="blok.footer_color | lightOrDark(this.$vuetify.theme.dark)"
			:dark="blok.footer_dark"
			:height="blok.footer_height"
			:class="blok.footer_helpers"
			:style="blok.footer_style"
		>
			<component
				:key="blok._uid"
				v-for="blok in blok.footer_content"
				:blok="blok"
				:is="blok.component | dashify"
			></component>
		</v-footer>
		<!-- Theme Switcher for Dev Purposes -->
		<v-btn
			v-if="blok.show_theme_switcher"
			@click="$vuetify.theme.dark = !$vuetify.theme.dark"
			fab
			color="primary"
			fixed
			bottom
			right
		>
			<v-icon v-if="this.$vuetify.theme.dark">mdi-weather-night</v-icon>
			<v-icon v-if="!this.$vuetify.theme.dark">mdi-weather-sunny</v-icon>
		</v-btn>
		<!-- Add Custom CSS Through Storyblok -->
		<style>
			{{blok.css}}
			body {
			}
		</style>
	</v-app>
</template>

<script>
export default {
	data: () => ({
		blok: {},
		sidebar: false
	}),
	mounted() {
		this.getData();
		if (process.client && process.env.theme === "auto") {
			window.matchMedia("(prefers-color-scheme: dark)").matches
				? (this.$vuetify.theme.dark = true)
				: (this.$vuetify.theme.dark = false);
		}
		// Fix scroll to hash on load for Chrome
		window.onload = function() {
			if (window.location.href.includes("#")) {
				let hash = window.location.href.split("#")[1];
				var el = document.getElementById(hash);
				var top = el.getBoundingClientRect().top;
				window.scrollTo(0, top + 60);
			}
		};
	},
	methods: {
		getData() {
			// load js client
			const StoryblokClient = require("storyblok-js-client");

			// init with access token
			const Storyblok = new StoryblokClient({
				accessToken: process.env.token,
				cache: {
					clear: "auto",
					type: "memory"
				}
			});

			Storyblok.get("cdn/stories/layout", {})
				.then(response => {
					this.blok = response.data.story.content;
					this.sidebar = null;
				})
				.catch(error => {
					console.log(error);
				});
		}
	},
	computed: {
		showDrawer() {
			let visible = false;
			if (this.blok.sidebar_content != false) {
				if (this.blok.sidebar_only_on_mobile) {
					visible = this.$vuetify.breakpoint.mdAndDown;
				} else {
					visible = true;
				}
			}
			return visible;
		},
		appBarNullCheck() {
			return this.blok.toolbar_content
				? this.blok.toolbar_content.length > 0
				: false;
		}
	},
	head() {
		return {
			title: this.blok.site_name,
			description: this.blok.site_description,
			link: [
				// CSS overrides from authoring
				{
					rel: "stylesheet",
					type: "text/css",
					href: this.blok.font
				}
			]
		};
	}
};
</script>

<style>
.v-application--wrap > .video-wrapper {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	overflow: hidden;
	object-fit: cover;
}
.v-footer--absolute.v-footer--inset {
	width: auto;
}
@media (display-mode: standalone) {
  .v-footer {
    padding-bottom: 20px;
  }
}
</style>
