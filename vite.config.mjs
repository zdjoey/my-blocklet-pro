import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import { vitePluginForArco } from '@arco-plugins/vite-react'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(

    ), createBlockletPlugin(), svgr(), vitePluginForArco(),

    ],

  };
});
