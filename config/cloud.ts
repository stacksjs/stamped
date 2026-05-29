import type { CloudConfig } from '@stacksjs/types'
import type { CloudConfig as TsCloudConfig } from '@stacksjs/ts-cloud'
import { servers } from '~/cloud/servers'
import { env } from '@stacksjs/env'

/**
 * Stacks Cloud Configuration
 *
 * This file defines your cloud infrastructure configuration for Stacks.
 * Supports both server mode (Forge-style) and serverless mode (Vapor-style).
 *
 * Environment variables:
 * - CLOUD_ENV: Set the active environment (production, staging, development)
 * - NODE_ENV: Fallback for CLOUD_ENV
 *
 * @see https://github.com/stacksjs/ts-cloud
 */

// ts-cloud configuration for deployment
export const tsCloud: TsCloudConfig = {
  /**
   * Project configuration
   */
  project: {
    name: 'stacks',
    slug: 'stacks',
    region: 'us-east-1', // Default AWS region
  },

  /**
   * Cloud provider selection.
   *
   * 'hetzner' provisions a Hetzner Cloud server (cheap VPS) and deploys the app
   * over SSH via ts-cloud's Hetzner driver. Falls back to 'aws' (CloudFormation)
   * when unset.
   */
  cloud: {
    provider: (process.env.CLOUD_PROVIDER as 'aws' | 'hetzner') || 'hetzner',
  },

  /**
   * Hetzner Cloud configuration (used when cloud.provider === 'hetzner').
   * The API token falls back to the HCLOUD_TOKEN / HETZNER_API_TOKEN env vars.
   */
  hetzner: {
    apiToken: process.env.HCLOUD_TOKEN,
    location: process.env.HCLOUD_LOCATION || 'fsn1',
    image: 'ubuntu-24.04',
  },

  /**
   * Deployment Mode
   *
   * - 'server': Traditional EC2-based deployment (Forge-style)
   * - 'serverless': Container + static site deployment (Vapor-style)
   */
  mode: 'server',

  /**
   * Environment configurations
   * Each environment can have its own settings
   *
   * Note: Deployment mode is automatically determined by your infrastructure configuration.
   * Simply define the resources you need below (functions, servers, storage, etc.) and
   * ts-cloud will deploy them accordingly. You can mix and match any resources.
   */
  environments: {
    production: {
      type: 'production',
      region: 'us-east-1',
      variables: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
      },
    },
    staging: {
      type: 'staging',
      region: 'us-east-1',
      variables: {
        NODE_ENV: 'staging',
        LOG_LEVEL: 'debug',
      },
    },
    development: {
      type: 'development',
      region: 'us-east-1',
      variables: {
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug',
      },
    },
  },

  /**
   * Infrastructure configuration
   * Define your cloud resources here
   */
  infrastructure: {
    /**
     * Compute Configuration
     *
     * For mode: 'server'
     * Defines the EC2 instances running your Stacks/Bun application.
     * When instances > 1, load balancer is automatically enabled.
     *
     * For mode: 'serverless'
     * These settings are not used. See 'containers' configuration instead.
     *
     * @example Single instance (development/staging)
     * compute: { instances: 1, size: 'micro' }
     *
     * @example Multiple instances with auto-scaling (production)
     * compute: {
     *   instances: 3,
     *   size: 'small',
     *   autoScaling: { min: 2, max: 10, scaleUpThreshold: 70 },
     * }
     *
     * @example Mixed instance fleet for cost optimization
     * compute: {
     *   instances: 3,
     *   fleet: [
     *     { size: 'small', weight: 1 },
     *     { size: 'medium', weight: 2 },
     *     { size: 'small', weight: 1, spot: true },
     *   ],
     *   spotConfig: {
     *     baseCapacity: 1,           // Always keep 1 on-demand
     *     onDemandPercentage: 50,    // 50% on-demand, 50% spot
     *     strategy: 'capacity-optimized',
     *   },
     * }
     */
    compute: {
      instances: 1,
      // Hetzner's old shared-Intel `cx` line (cx22/cx32/…) is deprecated; the
      // current cheap line is cx23 (2 vCPU / 4GB, ~€4/mo) in fsn1. Passing the
      // concrete Hetzner type bypasses ts-cloud's size→type shorthand. On AWS
      // this would be a t-family size; swap back to 'small' there.
      size: 'cx23',
      runtime: 'bun',
      allowSsh: true, // Hetzner deploys happen over SSH
      disk: {
        size: 20,
        type: 'ssd', // Provider-agnostic: 'standard', 'ssd', 'premium'
        encrypted: true,
      },
      // Uncomment for auto-scaling:
      // autoScaling: {
      //   min: 1,
      //   max: 5,
      //   scaleUpThreshold: 70,
      //   scaleDownThreshold: 30,
      // },
      // Uncomment for mixed instance fleet:
      // fleet: [
      //   { size: 'micro', weight: 1 },
      //   { size: 'small', weight: 2 },
      //   { size: 'micro', weight: 1, spot: true },
      // ],
      // spotConfig: {
      //   baseCapacity: 1,
      //   onDemandPercentage: 50,
      //   strategy: 'capacity-optimized',
      // },
    },

    /**
     * Server Definitions
     * EC2 instances for server mode deployment
     */
    servers: {
      app: servers.app,
      // app2: servers.app2,
      // web: servers.web,
      // cache: servers.cache,
    } as NonNullable<TsCloudConfig['infrastructure']>['servers'],

    /**
     * Jump Box / Bastion Host
     *
     * Provides SSH access to your private cloud resources.
     * Set to `true` for a default t3.micro jump box, or configure options.
     *
     * Connect via: buddy cloud:ssh
     * Or via SSM: aws ssm start-session --target <instance-id>
     */
    // jumpBox: true,
    // jumpBox: {
    //   enabled: true,
    //   size: 'micro',
    //   keyName: 'stacks-production',
    //   allowedCidrs: ['0.0.0.0/0'],
    //   databaseTools: true,
    //   mountEfs: true,
    // },

    /**
     * Container Configuration (for serverless mode only)
     *
     * Defines ECS Fargate containers running your Bun API.
     * Only used when mode: 'serverless'.
     *
     * @example Basic API container
     * containers: {
     *   api: {
     *     cpu: 256,    // 0.25 vCPU
     *     memory: 512, // 512 MB
     *     port: 3000,
     *     healthCheck: '/health',
     *   }
     * }
     *
     * @example Production API with auto-scaling
     * containers: {
     *   api: {
     *     cpu: 512,
     *     memory: 1024,
     *     port: 3000,
     *     desiredCount: 2,
     *     autoScaling: {
     *       min: 2,
     *       max: 10,
     *       targetCpuUtilization: 70,
     *     },
     *   }
     * }
     */
    containers: {
      api: {
        cpu: 512, // 256, 512, 1024, 2048, 4096
        memory: 1024, // Must be compatible with CPU (512 MB - 16 GB)
        port: 3000,
        healthCheck: '/health',
        desiredCount: 2,
        autoScaling: {
          min: 1,
          max: 10,
          targetCpuUtilization: 70,
          targetMemoryUtilization: 80,
        },
      },
    },

    /**
     * Load Balancer Configuration
     *
     * Controls whether to use an Application Load Balancer (ALB) for traffic distribution.
     * Automatically enabled when compute.instances > 1.
     *
     * Benefits of ALB:
     * - SSL termination with ACM certificates (free)
     * - Health checks and automatic failover
     * - HTTP to HTTPS redirect
     * - Multiple target support
     *
     * When to disable:
     * - Cost optimization (ALB costs ~$16/month minimum)
     * - Simple single-instance deployments
     * - Using Let's Encrypt for SSL instead of ACM
     */
    loadBalancer: {
      enabled: true,
      type: 'application',
      healthCheck: {
        path: '/health',
        interval: 30,
        healthyThreshold: 2,
        unhealthyThreshold: 5,
      },
    },

    /**
     * SSL/TLS Configuration
     *
     * Supports two providers:
     * - 'acm': AWS Certificate Manager (free, requires ALB or CloudFront)
     * - 'letsencrypt': Free certificates (works without ALB, runs on EC2)
     *
     * When loadBalancer.enabled = true:
     *   - Uses ACM by default (recommended)
     *   - Certificates are automatically requested and validated via DNS
     *   - HTTP to HTTPS redirect handled by ALB
     *
     * When loadBalancer.enabled = false:
     *   - Uses Let's Encrypt by default
     *   - Certificates are obtained and renewed automatically on EC2
     *   - Requires port 80 for HTTP-01 challenge or DNS for DNS-01
     */
    ssl: {
      enabled: true,
      provider: 'acm', // 'acm' | 'letsencrypt'
      domains: env.SSL_DOMAINS?.split(',') || ['stacksjs.com', 'www.stacksjs.com'],
      redirectHttp: true,
      // Let's Encrypt configuration (used when provider: 'letsencrypt' or loadBalancer.enabled: false)
      letsEncrypt: {
        email: env.LETSENCRYPT_EMAIL || 'admin@stacksjs.com',
        staging: false, // Set to true for testing
        autoRenew: true,
      },
    },

    /**
     * DNS Configuration
     */
    dns: {
      domain: env.APP_DOMAIN || 'stacksjs.com',
      hostedZoneId: env.AWS_HOSTED_ZONE_ID || 'Z01455702Q7952O6RCY37', // Route53 hosted zone ID
    },

    /**
     * Storage Configuration
     * S3 buckets for frontend, assets, uploads, etc.
     *
     * Mirrors the old CDK StorageStack defaults:
     * - public: website-hosting bucket for frontend (index.html)
     * - private: locked-down bucket for uploads, secrets, etc.
     * - docs: website-hosting bucket for documentation (conditional)
     * - logs: access-log bucket (retained on delete for audit)
     */
    storage: {
      'public': {
        public: true,
        encryption: true,
        versioning: true,
        website: {
          indexDocument: 'index.html',
          errorDocument: 'index.html',
        },
      },
      'private': {
        encryption: true,
        versioning: true,
      },
      'docs': {
        public: true,
        encryption: true,
        versioning: true,
        path: '/docs',
        pathRewriteStyle: 'flat',
        website: {
          indexDocument: 'index.html',
          errorDocument: '404.html',
        },
      },
      'blog': {
        public: true,
        encryption: true,
        versioning: true,
        path: '/blog',
        website: {
          indexDocument: 'index.html',
          errorDocument: '404.html',
        },
      },
      'logs': {
        encryption: true,
        versioning: false,
      },
      'backups': {
        encryption: true,
        versioning: true,
      },
      'email': {
        public: false,
        encryption: true,
        versioning: false,
      },
    },

    /**
     * Functions Configuration (optional)
     * Lambda functions for specific serverless workloads
     *
     * Note: Stacks uses Bun-based routing (./routes) for APIs, not Lambda functions.
     * Only add functions here for specific use cases like:
     * - Background job processing
     * - Event-driven tasks
     * - Image processing
     * - Scheduled tasks
     */
    functions: {
      // Example background worker (optional)
      // 'background-worker': {
      //   handler: 'worker.handler',
      //   runtime: 'nodejs20.x',
      //   timeout: 300,
      //   memorySize: 1024,
      // },
    },

    /**
     * Queue Configuration (SQS)
     * Background job processing, event-driven tasks, and scheduled work.
     *
     * Jobs defined in app/Jobs/*.ts are auto-discovered at deploy time
     * and scheduled via EventBridge rules targeting these queues.
     */
    queues: {
      jobs: {
        visibilityTimeout: 120,
        deadLetterQueue: true,
        maxReceiveCount: 3,
      },
      // Uncomment for ordered processing:
      // orders: {
      //   fifo: true,
      //   contentBasedDeduplication: true,
      // },
    },

    /**
     * Database Configuration (optional)
     */
    databases: {
      // Uncomment to add a database
      // 'main': {
      //   engine: 'postgres',
      //   instanceClass: 'db.t3.micro',
      //   storage: 20,
      //   username: 'admin',
      //   password: 'changeme123', // Use AWS Secrets Manager in production
      // },
    },

    /**
     * CDN Configuration
     * CloudFront distribution for global content delivery
     */
    cdn: {
      // Uncomment to enable CloudFront CDN
      // 'frontend': {
      //   origin: 'stacks-production-frontend.s3.us-east-1.amazonaws.com',
      //   customDomain: 'cdn.stacks-js.org',
      // },
    },

    /**
     * Redirects Configuration
     * Domain-level and path-level URL redirects.
     *
     * Domain redirects create S3 redirect buckets.
     * Path redirects create CloudFront Functions.
     */
    // redirects: {
    //   // Redirect these domains to your primary domain
    //   // domains: ['www.stacksjs.com', 'stacks.dev'],
    //   // target: 'stacksjs.com',
    //
    //   // Path-level redirects (source -> target)
    //   // paths: {
    //   //   '/old-page': '/new-page',
    //   //   '/blog/old-post': '/blog/new-post',
    //   // },
    // },

    /**
     * Cache Configuration (ElastiCache)
     * Redis or Memcached for in-memory caching
     */
    // Cache temporarily disabled for initial deployment - enable after stack is stable
    // cache: {
    //   type: 'redis',
    //   nodeType: 'cache.t3.micro',
    //   redis: {
    //     engineVersion: '7.1',
    //     numCacheNodes: 2,
    //     automaticFailoverEnabled: true,
    //     snapshotRetentionLimit: 7,
    //   },
    // },

    /**
     * Email Configuration (SES)
     * Amazon SES for transactional email sending
     *
     * Domain is auto-detected from dns.domain if not specified.
     * DNS records (SPF, DKIM, DMARC) are auto-created when hostedZoneId is available.
     *
     * Note: 'email' is not a valid property on InfrastructureConfig.
     * Uncomment and move to a supported config section when the type supports it.
     */
    // email: {
    //   domain: 'stacksjs.com',
    //   configurationSet: true,
    //   enableDkim: true,
    //   server: {
    //     enabled: true,
    //   },
    // },

    /**
     * Search Configuration (OpenSearch)
     * Full-text search engine powered by OpenSearch
     */
    // search: {
    //   instanceType: 't3.small.search',
    //   instanceCount: 1,
    //   volumeSize: 10,
    //   volumeType: 'gp3',
    //   encryption: {
    //     atRest: true,
    //     nodeToNode: true,
    //   },
    //   autoTune: true,
    // },

    /**
     * File System Configuration (EFS)
     * Elastic File System for shared storage across instances
     */
    // fileSystem: {
    //   shared: {
    //     encrypted: true,
    //     performanceMode: 'generalPurpose',
    //     throughputMode: 'bursting',
    //   },
    // },

    /**
     * AI Configuration (Bedrock)
     * Amazon Bedrock for AI/ML model access
     */
    // ai: {
    //   models: ['anthropic.claude-3-5-sonnet-20241022-v2:0'],
    //   allowStreaming: true,
    //   service: 'ecs', // 'ecs' | 'ec2' | 'lambda'
    // },

    /**
     * Tunnel Configuration
     *
     * Deploy a custom tunnel server for `buddy share`.
     * Only needed if you want your own tunnel domain — localtunnel.dev
     * is the shared Stacks default and requires no deployment.
     *
     * Set enabled: true and provide a custom domain to deploy a
     * dedicated tunnel server via `buddy deploy:tunnel`.
     */
    // tunnel: {
    //   enabled: false,
    //   // domain: 'tunnel.mycompany.com',  // must NOT be localtunnel.dev
    //   // region: 'us-east-1',
    //   // ssl: { enabled: true },
    // },

    /**
     * Monitoring Configuration (optional)
     */
    monitoring: {
      // Uncomment to add alarms
      // alarms: {
      //   'high-cpu': {
      //     metricName: 'CPUUtilization',
      //     namespace: 'AWS/EC2',
      //     threshold: 80,
      //     comparisonOperator: 'GreaterThanThreshold',
      //   },
      // },
    },
  },

  /**
   * Sites Configuration (optional)
   * For multi-site deployments
   */
  sites: {
    main: {
      // Local project directory packaged and shipped to the server. The Hetzner
      // deploy runs `buddy serve` (the production STX server + coming-soon gate)
      // directly with Bun. We invoke the CLI entry rather than the `./buddy`
      // shell wrapper because the wrapper bootstraps pantry, which isn't what a
      // long-lived systemd service wants.
      root: '.',
      path: '/',
      port: 3000,
      start: 'bun storage/framework/core/buddy/src/cli.ts serve',
      // Runtime environment written to the server's `.env` by ts-cloud. The
      // deploy script overwrites `.env` from these entries, so every value the
      // production server needs to boot (and stay behind the coming-soon page)
      // must live here. Secrets are read from the local env at deploy time
      // rather than hardcoded.
      env: {
        APP_ENV: 'production',
        NODE_ENV: 'production',
        APP_NAME: env.APP_NAME || 'Stamped',
        APP_KEY: env.APP_KEY || '',
        APP_URL: env.APP_URL || '',
        // Hold every visitor behind the coming-soon holding page. Visitors who
        // know the secret can bypass via `?secret=…` / the magic-link cookie.
        APP_COMING_SOON: 'true',
        APP_COMING_SOON_SECRET: env.APP_COMING_SOON_SECRET || 'stamped-preview',
        APP_MAINTENANCE: 'false',
        PORT: '3000',
      },
      // Dependencies are installed ON THE SERVER from the shipped lockfile
      // rather than packed into the release tarball — this keeps the upload
      // tiny (source only, no node_modules/pantry). bun reproduces the exact
      // dependency tree from bun.lock (incl. the `@stacksjs/*` workspace
      // symlinks) in seconds. Requires `@stacksjs/ts-cloud` >= 0.2.21, which is
      // the first release that runs `preStart` on the server during deploy.
      preStart: [
        'bun install --frozen-lockfile',
      ],
      // No domain: served directly on the server's public IP (http://IP:3000).
    },
  },
}

// Stacks cloud configuration (for existing Stacks cloud features)
const config: CloudConfig = {
  // Add Stacks-specific cloud config here if needed
}

export default config
