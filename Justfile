# 重新构建项目和镜像并更新容器
rebuild:
    pnpm run build
    docker rm -f fate
    docker rmi -f fate
    docker build -t fate .
    docker compose up -d