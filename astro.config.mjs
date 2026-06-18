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
          label: 'Guia do usuário',
          items: [
            { label: 'Visão geral', slug: 'user-guide' },
            { label: 'Instalação', slug: 'user-guide/installation' },
            { label: 'Conexão BLE', slug: 'user-guide/connecting' },
            { label: 'Console', slug: 'user-guide/console' },
            { label: 'Comandos', slug: 'user-guide/commands' },
            { label: 'Editar parâmetros', slug: 'user-guide/edit-parameters' },
            { label: 'Editar mapa', slug: 'user-guide/edit-map' },
            { label: 'Monitor em tempo real', slug: 'user-guide/realtime' },
            { label: 'Protocolo wire', slug: 'user-guide/wire-protocol' }
          ]
        },
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
