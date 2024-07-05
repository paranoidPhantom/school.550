import { addComponent, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
    setup() {
        // import { MyComponent as MyAutoImportedComponent } from 'my-npm-package'
        addComponent({
            name: "MDEditor",
            export: "MdEditor",
            filePath: "md-editor-v3",
        });
    },
});
