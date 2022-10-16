export default {
  path: '/steg',
  name: 'steg',
  component: () => import('@/pages/steg/index.vue'),
  children: [
    {
      path: '',
      redirect: { name: 'tutorial' },
      meta: {
        title: '',
      },
    },
    {
      path: 'tutorial',
      name: 'tutorial',
      component: () => import('@/pages/steg/tutorial/index.vue'),
      meta: {
        title: '快速开始',
      },
    },
    {
      path: 'encode',
      name: 'encode',
      component: () => import('@/pages/steg/encode/index.vue'),
      meta: {
        title: '加密',
      },
      children: [
        {
          path: '',
          redirect: { name: 'encodeImage' },
          meta: {
            title: '',
          },
        },
        {
          path: 'encode-image',
          name: 'encodeImage',
          component: () => import('@/pages/steg/encode/encodeImage.vue'),
          meta: {
            title: '加密-图片',
          },
        },
        {
          path: 'encode-doc',
          name: 'encodeDoc',
          component: () => import('@/pages/steg/encode/encodeDoc.vue'),
          meta: {
            title: '加密-文字',
          },
        },
      ],
    },
    {
      path: 'decode',
      name: 'decode',
      component: () => import('@/pages/steg/decode/index.vue'),
      meta: {
        title: '解密',
      },
      children: [
        {
          path: '',
          redirect: { name: 'encodeImage' },
          meta: {
            title: '',
          },
        },
        {
          path: 'decode-image',
          name: 'decodeImage',
          component: () => import('@/pages/steg/decode/decodeImage.vue'),
          meta: {
            title: '解密-图片',
          },
        },
        {
          path: 'decode-doc',
          name: 'decodeDoc',
          component: () => import('@/pages/steg/decode/decodeDoc.vue'),
          meta: {
            title: '解密-文字',
          },
        },
        {
          path: 'decode-intelligent',
          name: 'decodeIntelligent',
          component: () => import('@/pages/steg/decode/decodeIntelligent.vue'),
          meta: {
            title: '解密-智能(BETA)',
          },
        },
      ],
    },
    {
      path: 'drift',
      name: 'drift',
      component: () => import('@/pages/steg/drift/index.vue'),
      meta: {
        title: '漂流信',
      },
    },
  ],
}
