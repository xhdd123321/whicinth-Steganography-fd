# whicinth-Steganography-fd

[![OSCS Status](https://www.oscs1024.com/platform/badge/xhdd123321/whicinth-steganography-fd.svg?size=small)](https://www.oscs1024.com/project/xhdd123321/whicinth-steganography-fd?ref=badge_small)

风信——用图片承载无法言说的秘密

- 这里是 whicinth 前端源码
- 基于 Vue3.0 全家桶（Vue 3 + TypeScript + Vite）
- 配套[后端](https://github.com/xhdd123321/whicinth-Steganography-bd)戳这里

> 开发文档：[Re：从零搭建 Vue3 轻量级开发脚手架 | 逐暗的小站 (zhu-an.cn)](https://www.zhu-an.cn/todo/Re：从零搭建Vue3轻量级开发脚手架/)

## 简介

![image-20221021004444216](https://img.zhu-an.cn/img/20221021004444.png)

## 服务部署

### 一、本地开发

#### 配置文件
本地启动项目`.env.development`中的变量会自动注入环境

#### 部署流程
1. git clone & cd
2. yarn # 安装依赖
3. yarn dev # 开发模式启动项目

### 二、线上部署

#### 配置文件
打包时`.env.development`中的变量会自动注入环境

#### 部署流程
1. yarn build
2. 上传dist至服务器站点目录
3. 配置nginx,示例如下:

#### NGINX配置参考
```shell
# http配置转发https
server {
        listen 80;
        server_name your-domain;
        rewrite ^(.*)$ https://$host$1 permanent;
        location / {
        }
}
# https配置
server {
        listen 443 ssl;
        server_name your-domain;
        client_max_body_size 50m;
        ssl_certificate cert/your-domain.pem;
        ssl_certificate_key cert/your-domain.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        # 后端服务
        location /api/ {
                rewrite ^/api/(.*) /$1  break;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass http://127.0.0.1:8888;
        }
        
        # 前端服务
        location / {
                root /var/www/whicinth-steganography-fd/dist;
                index index.html;
                try_files $uri $uri/ /index.html;       # 解决单页面应用刷新404问题
        }
}
```