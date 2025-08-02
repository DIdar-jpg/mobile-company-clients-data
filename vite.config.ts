import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
   server: {
      host: true,
   },

   plugins: [react(), tailwindcss()],
   base: 'mobile-company-clients-data',
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
});
