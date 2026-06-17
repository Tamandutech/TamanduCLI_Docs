// @ts-check
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://tamandutech.github.io/',
  base: '/TamanduCLI_Docs',
  integrations: [
    starlight({
      title: 'TamanduCLI Docs',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Tamandutech'
        }
      ],
      sidebar: [
        {
          label: 'Integração C++',
          items: [
            { label: 'Visão geral', slug: 'cpp-integration/overview' },
            {
              label: 'Primeiros passos',
              slug: 'cpp-integration/getting-started'
            },
            {
              label: 'Tipos e constantes wire',
              slug: 'cpp-integration/wire-types'
            },
            { label: 'Parse wire', slug: 'cpp-integration/wire-parsing' },
            {
              label: 'Serialização wire',
              slug: 'cpp-integration/wire-serialization'
            },
            {
              label: 'Emissor de protocolo',
              slug: 'cpp-integration/wire-protocol'
            },
            { label: 'CliMap', slug: 'cpp-integration/cli-map' }
          ]
        }
      ]
    })
  ]
});
