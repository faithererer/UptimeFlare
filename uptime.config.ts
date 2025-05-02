import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // Title for your status page
  title: "FAITHERERER's Status Page",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'mailto:jczhanghh@qq.com', label: 'Email Me', highlight: true },
    // 你可以根据需要添加更多链接，例如：
    // { link: 'https://github.com/your-repo', label: 'GitHub' },
    // { link: 'https://your-blog.com', label: 'Blog' },
  ],
  // [OPTIONAL] Group your monitors
  // If not specified, all monitors will be shown in a single list
  // If specified, monitors will be grouped and ordered, not-listed monitors will be invisble (but still monitored)
  group: {
    "🌐 公共服务": ['imgbed_monitor', 'gemini_polling_monitor', 'alist_monitor', 'blog', 'sillytavern_monitor'],
    "🖥️ 服务器": ['cn2_2c_2g', 'tokyo_bgp_lite', 'rk_us_1h1g', 'ak_hk_1c1g']
  },
}
const workerConfig: WorkerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    // --- 公共服务 ---
    {
      // `id` should be unique, history will be kept if the `id` remains constant
      id: 'imgbed_monitor',
      // `name` is used at status page and callback message
      name: '图床服务',
      // `method` should be a valid HTTP Method
      method: 'GET',
      // `target` is a valid URL
      target: 'https://imgbed.zjcspace.xyz/',
      // [OPTIONAL] `tooltip` is ONLY used at status page to show a tooltip
      tooltip: '图片存储服务可用性监控',
      // [OPTIONAL] `statusPageLink` is ONLY used for clickable link at status page
      statusPageLink: 'https://imgbed.zjcspace.xyz/',
      // [OPTIONAL] `hideLatencyChart` will hide status page latency chart if set to true
      // hideLatencyChart: false,
      // [OPTIONAL] `expectedCodes` is an array of acceptable HTTP response codes, if not specified, default to 2xx
      expectedCodes: [200],
      // [OPTIONAL] `timeout` in millisecond, if not specified, default to 10000
      timeout: 10000,
      // [OPTIONAL] headers to be sent
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
      },
      // [OPTIONAL] body to be sent
      // body: '',
      // [OPTIONAL] if specified, the response must contains the keyword to be considered as operational.
      // responseKeyword: '<title>ZJCSPACE图床</title>',
      // [OPTIONAL] if specified, the response must NOT contains the keyword to be considered as operational.
      // responseForbiddenKeyword: 'error',
      // [OPTIONAL] if specified, will call the check proxy to check the monitor
      checkProxy: 'worker://apac',
      // [OPTIONAL] if true, the check will fallback to local if the specified proxy is down
      // checkProxyFallback: true,
    },
    {
      id: 'gemini_polling_monitor',
      name: 'Gemini轮询',
      method: 'GET',
      target: 'https://faithererer-gemini-balance.hf.space/',
      tooltip: 'Gemini协议消息轮询服务',
      statusPageLink: 'https://faithererer-gemini-balance.hf.space/',
      expectedCodes: [200, 301, 401], // 包含可能的跳转或认证状态码
      timeout: 8000,
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
      },
      // responseKeyword: 'gemini protocol', // 如果服务返回纯文本可添加验证
      checkProxy: 'worker://apac'
    },
    {
      id: 'alist_monitor',
      name: 'alist网盘',
      method: 'GET',
      target: 'http://alist2.zjcspace.xyz:5244/',
      tooltip: 'alist服务可用性监控',
      statusPageLink: 'http://alist2.zjcspace.xyz:5244/',
      expectedCodes: [200],
      timeout: 10000,
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
      },
      // responseKeyword: '<title>Alist</title>', // 假设Alist页面的title是这个
      checkProxy: 'worker://apac'
    },
    {
      id: 'sillytavern_monitor',
      name: 'sillytavern酒馆',
      method: 'GET',
      target: 'http://sy.zjcspace.xyz/',
      tooltip: '酒馆可用性监控',
      statusPageLink: 'http://sy.zjcspace.xyz/',
      expectedCodes: [200, 401], // 可能需要认证
      timeout: 10000,
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
      },
      // responseKeyword: '<title>SillyTavern</title>', // 假设SillyTavern页面的title是这个
      checkProxy: 'worker://apac'
    },
    {
      id: 'blog',
      name: 'blog',
      method: 'GET',
      target: 'http://blog.zjcspace.xyz/',
      tooltip: '博客',
      // 注意：你原来的 statusPageLink 指向了 sillytavern，这里保留了，请确认是否正确
      statusPageLink: 'http://sy.zjcspace.xyz/',
      expectedCodes: [200], // 博客通常返回200，如果需要认证则添加401等
      timeout: 10000,
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
      },
      // responseKeyword: '<title>Your Blog Title</title>', // 替换成你博客的实际标题
      checkProxy: 'worker://apac'
    },
    // --- 服务器 ---
    {
      id: 'tokyo_bgp_lite',
      name: 'Tokyo BGP Lite',
      // `method` should be `TCP_PING` for tcp monitors
      method: 'TCP_PING',
      // `target` should be `host:port` for tcp monitors
      target: '103.75.70.204:22', // 监控 SSH 端口 22
      tooltip: 'Tokyo BGP Lite (SSH Port)',
      // statusPageLink: '', // 可以添加服务器管理面板链接等
      timeout: 5000,
      checkProxy: 'worker://apac'
    },
    {
      id: 'rk_us_1h1g',
      name: 'rk-us-1h1g',
      method: 'TCP_PING',
      target: '107.172.100.73:22',
      tooltip: 'rk-us-1h1g (SSH Port)',
      timeout: 5000,
      checkProxy: 'worker://apac'
    },
    {
      id: 'ak_hk_1c1g',
      name: 'ak-hk-1c1g',
      method: 'TCP_PING',
      target: '154.83.84.149:22',
      tooltip: 'ak-hk-1c1g (SSH Port)',
      timeout: 5000,
      checkProxy: 'worker://apac'
    },
      {
      id: 'cn2_2c_2g',
      name: 'cn2_2c_2g',
      method: 'TCP_PING',
      target: '198.44.187.87:22',
      tooltip: 'cn2_2c_2g (SSH Port)',
      timeout: 5000,
      checkProxy: 'worker://apac'
    },
    // --- 原来注释掉的监控项 ---
    // {
    //   id: 'ak_2c2g_hk',
    //   name: 'ak-2c2g-hk',
    //   method: 'TCP_PING',
    //   target: '156.224.78.238:22',
    //   tooltip: 'ak-2c2g-hk (SSH Port)',
    //   timeout: 5100,
    //   // checkProxy: 'worker://apac' // 如果需要代理检查，取消注释
    // },
    // {
    //   id: 'chengdu_ecs_special',
    //   name: '成都ECS特价型',
    //   method: 'TCP_PING',
    //   target: '110.40.87.40:22',
    //   tooltip: '成都ECS特价型 (SSH Port)',
    //   timeout: 5000,
    //   // checkProxy: 'worker://apac' // 如果需要代理检查，取消注释
    // },
    // {
    //   id: 'yingyu',
    //   name: '樱雨云',
    //   method: 'TCP_PING',
    //   // 注意：端口是 36645，不是默认的 22
    //   target: '47.108.78.18:36645',
    //   tooltip: '樱雨云 (Port 36645)',
    //   timeout: 5000,
    //   // checkProxy: 'worker://apac' // 如果需要代理检查，取消注释
    // }
  ],
  notification: {
    // [Optional] apprise API server URL
    // if not specified, no notification will be sent
    appriseApiServer: 'https://apprise.example.com/notify',
    // [Optional] recipient URL for apprise, refer to https://github.com/caronc/apprise
    // if not specified, no notification will be sent
    recipientUrl: 'tgram://bottoken/ChatID',
    // [Optional] timezone used in notification messages, default to "Etc/GMT"
    timeZone: 'Asia/Shanghai',
    // [Optional] grace period in minutes before sending a notification
    // notification will be sent only if the monitor is down for N continuous checks after the initial failure
    // if not specified, notification will be sent immediately
    gracePeriod: 5,
    // [Optional] disable notification for monitors with specified ids
    skipNotificationIds: ['foo_monitor', 'bar_monitor'],
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called when there's a status change for any monitor
      // Write any Typescript code here
      // This will not follow the grace period settings and will be called immediately when the status changes
      // You need to handle the grace period manually if you want to implement it
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called EVERY 1 MINTUE if there's an on-going incident for any monitor
      // Write any Typescript code here
    },
  },
}

// You can define multiple maintenances here
// During maintenance, an alert will be shown at status page
// Also, related downtime notifications will be skipped (if any)
// Of course, you can leave it empty if you don't need this feature
// const maintenances: MaintenanceConfig[] = []
const maintenances: MaintenanceConfig[] = [
  {
    // [Optional] Monitor IDs to be affected by this maintenance
    monitors: ['foo_monitor', 'bar_monitor'],
    // [Optional] default to "Scheduled Maintenance" if not specified
    title: 'Test Maintenance',
    // Description of the maintenance, will be shown at status page
    body: 'This is a test maintenance, server software upgrade',
    // Start time of the maintenance, in UNIX timestamp or ISO 8601 format
    start: '2025-04-27T00:00:00+08:00',
    // [Optional] end time of the maintenance, in UNIX timestamp or ISO 8601 format
    // if not specified, the maintenance will be considered as on-going
    end: '2025-04-30T00:00:00+08:00',
    // [Optional] color of the maintenance alert at status page, default to "yellow"
    color: 'blue',
  },
]

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig, maintenances }
